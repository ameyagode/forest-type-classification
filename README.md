# Forest type classification of tropical forests

Support Vector Machine based classification of Landsat8 imagery with pre defined training sites

## Description
This code will create a forest type map for a pre-defined time period in tropical forests. For forests of South India, training sites have been predefined from extensive field survey. Alternatively, user can define their own polygons to ensure maximum accuracy in their own area of interest by merely changing coordinates.

## Why SVM?
Forest type classification in tropical forests is a difficult task owing to high species diversity and seasonality. Using multi season images to classify large areas locally requires intensive computational resources and time. To overcome this, we use Google Earth Engine to leverage their massive computational capabilities.
Additionally, the hyperplane generated between two classes helps distinguish between spectrally similar classes more accurately than traditional approaches (Ex: Maximum Likelihood)
## Workflow

* Import Landsat 8 simple composite and filter by date. User can choose the specific time period for their analysis.
* Select bands for classification
* Define training sites as geometries. User can add their own ground truth by simply adding bottom left and top right coordinates of their polygons.
* Convert geometries to the FeatureCollection type by defining a Class ID (Ex: 1,2 and 3) and extract pixel values for each polygon from selected bands.
* Train classifier using training FeatureCollection to classify image
* Display map, define appropriate color pallette for classes, add true color composite, training polygons and classification results.
* Add legend and define appropriate names for classes
* Export results to Google Drive

## Usage

* Login to Google Earth Engine account
* Use this link to run the script:
  https://code.earthengine.google.com/?scriptPath=users%2Fameyagode%2FmyCode%3Aclassification
* Change 'FilterDate' in the code to time period of your choice
* Click 'Run'. All three layers should load subsequently.
* To assess class of any given pixel click on 'Inspector' tab and then click on pixel of your choice. Class will appear in the window below






