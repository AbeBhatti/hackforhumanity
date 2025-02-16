from flask import Flask, jsonify
from flask_cors import CORS
import ee

# Initialize Flask app
app = Flask(__name__)

# Enable CORS (Cross-Origin Resource Sharing)
CORS(app)

# Initialize Earth Engine
ee.Authenticate()
ee.Initialize(project="ee-abhinavtalaa")

@app.route('/wildfire_risk', methods=['GET'])
def wildfire_risk():
    try:
        # Get the wildfire risk data
        risk_data = get_wildfire_risk_data()  # Call the Earth Engine function
        print("Risk Data:", risk_data)  # Debug log to check the data
        return jsonify(risk_data)  # Return data as JSON
    except Exception as e:
        print(f"Error in Flask route: {e}")
        return jsonify({"error": f"Error fetching data: {str(e)}"}), 500

def get_wildfire_risk_data():
    # Earth Engine logic for calculating wildfire risk
    us_roi = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017').filter(ee.Filter.eq('country_co', 'US'))
    
    # Load datasets (MODIS, SMAP, and others)
    ndvi_dataset = ee.ImageCollection('MODIS/061/MOD13A2').select('NDVI')
    soil_moisture_dataset = ee.ImageCollection('NASA/SMAP/SPL4SMGP/007').select('sm_surface')
    lst_dataset = ee.ImageCollection('MODIS/061/MOD11A2').select('LST_Day_1km')
    precipitation_dataset = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY').select('precipitation')
    wind_speed_dataset = ee.ImageCollection('ECMWF/ERA5/DAILY').select('u_component_of_wind', 'v_component_of_wind')
    land_cover_dataset = ee.ImageCollection('MODIS/061/MCD12Q1').select('LC_Type1')
    elevation_dataset = ee.Image('USGS/SRTMGL1_003').select('elevation')

    # Filter datasets by date and region
    start_date = '2020-8-3'
    end_date = '2020-9-3'

    ndvi_filtered = ndvi_dataset.filterDate(start_date, end_date).filterBounds(us_roi)
    soil_moisture_filtered = soil_moisture_dataset.filterDate(start_date, end_date).filterBounds(us_roi)
    lst_filtered = lst_dataset.filterDate(start_date, end_date).filterBounds(us_roi)
    precipitation_filtered = precipitation_dataset.filterDate(start_date, end_date).filterBounds(us_roi)
    wind_speed_filtered = wind_speed_dataset.filterDate(start_date, end_date).filterBounds(us_roi)
    land_cover_filtered = land_cover_dataset.filterDate(start_date, end_date).filterBounds(us_roi)
    elevation_filtered = elevation_dataset.clip(us_roi)

    # Check if wind_speed_filtered is empty
    use_wind_speed = False
    if wind_speed_filtered.size().getInfo() > 0:
        use_wind_speed = True

    # Combine all indices into a single image
    def combine_indices(image):
        ndvi = ndvi_filtered.mean().clip(us_roi)
        soil_moisture = soil_moisture_filtered.mean().clip(us_roi)
        lst = lst_filtered.mean().clip(us_roi)
        precipitation = precipitation_filtered.mean().clip(us_roi)
        land_cover = land_cover_filtered.mean().clip(us_roi)
        elevation = elevation_filtered.clip(us_roi)
        
        if use_wind_speed:
            wind_speed = wind_speed_filtered.mean().clip(us_roi)
            return image.addBands(ndvi).addBands(soil_moisture).addBands(lst).addBands(precipitation).addBands(wind_speed).addBands(land_cover).addBands(elevation)
        else:
            return image.addBands(ndvi).addBands(soil_moisture).addBands(lst).addBands(precipitation).addBands(land_cover).addBands(elevation)

    # Predict wildfire risk
    def predict_wildfire_risk(image):
        fpi = image.select('LST_Day_1km').multiply(image.select('NDVI')).divide(image.select('sm_surface')).rename('FPI')
        precipitation = image.select('precipitation')
        
        if use_wind_speed:
            wind_speed = image.select('wind_speed')
            wildfire_risk = fpi.multiply(1.5).add(precipitation.multiply(-0.5)).add(wind_speed.multiply(0.8)).rename('Wildfire_Risk')
        else:
            wildfire_risk = fpi.multiply(1.5).add(precipitation.multiply(-0.5)).rename('Wildfire_Risk')
        
        return image.addBands(wildfire_risk)

    wildfire_risk_dataset = lst_filtered.map(combine_indices).map(predict_wildfire_risk)

    # Reduce the ImageCollection to a single Image (e.g., mean)
    wildfire_risk_image = wildfire_risk_dataset.mean()

    # Load US cities dataset
    cities = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017').filter(ee.Filter.eq('country_co', 'US'))

    # Extract wildfire risk for cities
    city_risk = wildfire_risk_image.reduceRegions(
        collection=cities,
        reducer=ee.Reducer.mean(),
        scale=1000
    )

    # Sort cities by wildfire risk
    sorted_cities = city_risk.sort('Wildfire_Risk', False)

    # Get the top 20 fire-prone cities (limit results to top 20)
    top_cities = sorted_cities.limit(20).getInfo()

    # Format data for frontend
    results = []
    for city in top_cities['features']:
        coordinates = city['geometry']['coordinates']
        risk = city['properties']['Wildfire_Risk']
        results.append({"coordinates": coordinates, "risk": risk})

    return results

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
