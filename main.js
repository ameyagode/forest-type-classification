// Create Landsat 8 true color composite
var landsat = ee.ImageCollection('LANDSAT/LC08/C01/T1');

var image = ee.Algorithms.Landsat.simpleComposite({
  collection: landsat.filterDate('2019-01-01', '2021-05-31'),
  asFloat: true
});

// Select processing bands
var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8' , 'B10', 'B11'];

//Define geometries for creating training sets
var DD1 = ee.Geometry.Rectangle(74.325881,  14.638861, 74.327994,  14.639757);
var DD2 = ee.Geometry.Rectangle(74.196001,  14.780322, 74.197567,  14.781384);
var DD3 = ee.Geometry.Rectangle(74.210199,  14.862824, 74.211542,  14.863990);
var DD4 = ee.Geometry.Rectangle(74.247636,  14.757523, 74.248298,  14.759022);
var MD1 = ee.Geometry.Rectangle(74.564774,  14.746348, 74.566442,  14.747279);
var MD2 = ee.Geometry.Rectangle(74.510162,  14.887977, 74.512693,  14.889684);
var MD3 = ee.Geometry.Rectangle(74.409210,  14.844289, 74.410951,  14.846913);
var MD4 = ee.Geometry.Rectangle(74.303123,  14.831536, 74.304124,  14.832340);
var SE1 = ee.Geometry.Rectangle(74.243270,  14.935430, 74.244553,  14.936738);
var SE2 = ee.Geometry.Rectangle(74.243270,  14.935430, 74.244553,  14.936738);
var SE3 = ee.Geometry.Rectangle(74.472883,  14.822070, 74.474295,  14.823158);
var SE4 = ee.Geometry.Rectangle(74.299015,  14.863348, 74.301085,  14.864831);
var SE5 = ee.Geometry.Rectangle(74.288993,  14.934462, 74.291931,  14.936449);
var SE6 = ee.Geometry.Rectangle(74.346166,  14.860911, 74.348308,  14.863651);
var EG1 = ee.Geometry.Rectangle(74.496960,  14.735478, 74.499081,  14.737130);
var EG2 = ee.Geometry.Rectangle(74.523534,  14.759595, 74.524810,  14.760361);
var EG3 = ee.Geometry.Rectangle(74.499138,  14.764353, 74.499832,  14.765085);
var EG4 = ee.Geometry.Rectangle(74.159269,  14.795443, 74.164253,  14.798071);
var EG5 = ee.Geometry.Rectangle(74.155356,  14.911740, 74.157406,  14.913397);
var BR1 = ee.Geometry.Rectangle(74.226363,  14.892642, 74.230079,  14.896582);
var BR2 = ee.Geometry.Rectangle(74.489043,  14.817542, 74.490537,  14.818500);

// Ground truth to FeatureCollection
var gt = ee.FeatureCollection([
  ee.Feature(DD1, {'class': 1}),
  ee.Feature(DD2, {'class': 1}),
  ee.Feature(DD3, {'class': 1}),
  ee.Feature(DD4, {'class': 1}),
  ee.Feature(MD1, {'class': 2}),
  ee.Feature(MD2, {'class': 2}),
  ee.Feature(MD3, {'class': 2}),
  ee.Feature(MD4, {'class': 2}),
  ee.Feature(SE1, {'class': 3}),
  ee.Feature(SE2, {'class': 3}),
  ee.Feature(SE3, {'class': 3}),
  ee.Feature(SE4, {'class': 3}),
  ee.Feature(SE5, {'class': 3}),
  ee.Feature(SE6, {'class': 3}),
  ee.Feature(EG1, {'class': 4}),
  ee.Feature(EG2, {'class': 4}),
  ee.Feature(EG3, {'class': 4}),
  ee.Feature(EG4, {'class': 4}),
  ee.Feature(EG5, {'class': 4}),
  ee.Feature(BR1, {'class': 6}),
  ee.Feature(BR2, {'class': 6}),
]);
// Get pixel values from each training polygon
var training = image.sampleRegions({
  collection: gt,
  properties: ['class'],
  scale: 30
});

// Define Support Vector Machine and parameters
var svm = ee.Classifier.libsvm({
  kernelType: 'RBF',
  gamma: 0.5,
  cost: 10
});

// Training and classification
var trained = svm.train(training, 'class', bands);
var foresttype = image.classify(trained);

// Display the classification result and the input image.
Map.setCenter(74.349935,  14.846852, 8);
Map.addLayer(image, {bands: ['B4', 'B3', 'B2'], max: 0.5, gamma: 2});
Map.addLayer(gt, {}, 'training polygons');
Map.addLayer(foresttype,
             {min: 1, max: 6, palette: ['yellow', 'cyan', 'purple' , 'green' , 'blue' , 'white']},
             'forest');
             
             
             
 // set position of panel
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});
 
// Create legend title
var legendTitle = ui.Label({
  value: 'Forest Type',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
    }
});
 
// Add the title to the panel
legend.add(legendTitle);
 
// Creates and styles 1 row of the legend.
var makeRow = function(color, name) {
 
      // Create the label that is actually the colored box.
      var colorBox = ui.Label({
        style: {
          backgroundColor: '#' + color,
          // Use padding to give the box height and width.
          padding: '8px',
          margin: '0 0 4px 0'
        }
      });
 
      // Create the label filled with the description text.
      var description = ui.Label({
        value: name,
        style: {margin: '0 0 4px 6px'}
      });
 
      // return the panel
      return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
      });
};
 
//  Palette with the colors
var palette =['FFFF00', '00FFFF', 'A020F0' , '00FF00' , '0000FF' , 'FFFFFF'];
 
// name of the legend
var names = ['Dry Deciduous','Moist Deciduous','Semi Evergreen', 'Evergreen', 'Grassland'];
 
// Add color and and names
for (var i = 0;  i < 6; i++) {
  legend.add(makeRow(palette[i], names[i]));
  }  
 
// add legend to map (alternatively you can also print the legend to the console)
Map.add(legend);

// Exporting results to Google Drive
Export.image.toDrive({
image: foresttype,
description: 'Forest Type',
scale: 30,
region: geometry,
crs: "EPSG:32643",
maxPixels: 8185883500     // Define upper pixel limit for export
});
