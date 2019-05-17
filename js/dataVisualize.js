//this code uses jquery (http://jquery.com)
//and the jquery Address plugin (http://www.asual.com/jquery/address/)
import $ from './jquery';
import './jquery.address-1.5';
import createMap from './map/createMap';
import parseJsonToGmap from './map/parseJsonToGmap';
import showByIndicator from './nav/showByIndicator';

export let informationChart, kmapAllAdminAreas;
/**
 * global variable that holds the map
 */
export let map;

/**
 *  gives us a list of names for geographicAreas
 */
export const geographicAreaNames = [];
/**
 * global variable holding an array of points for each area so areaPoints["bomi"]
 * would return an array of all the points for Bomi
 */

/**
 * global variable holding the polygons for each area. areaGPolygons["bomi"]
 * would return the polygon for Bomi
 */
export const areaGPolygons = [];
/**
 * global variable holding all the Labels for each area
 */
export const labels = [];
/**
 * global variable that holds all of the info windows
 */
export const infoWindows = [];
/**
 * global array that maps the unqiue string indicator to the parameters that would
 * be fed into UpdateAreaAllData(title, data, nationalAverage). This way we can
 * use indicators to call the update method to redraw the map
 */
export let indicatorsToUpdateParams = [];
const resetIndicators = () => indicatorsToUpdateParams = [];
$(function () {
    //patches issue with top navigation menu
    $('.pagetitlewrap').css('z-index', 120);
    $.getJSON('config.json', function (config) {
        informationChart = config.informationChart;

        informationChart.url = 'http://chart.apis.google.com/chart?' +
            'chxs=0,676767,' + informationChart.axisLabelStylesFont + ',2,l,676767|1,393939,' + informationChart.axisLabelStylesFont + ',1,l,676767' +
            '&chxt=x,y' +
            '&chbh=' + informationChart.barHeight + ',' + informationChart.barHeightMargin + ',0' +
            '&chs=' + informationChart.width + 'x<HEIGHT>' +
            '&cht=bhs' +
            '&chco=3E4E6E,CC0000' +
            '&chg=25,0,5,9' +
            '&chts=000000,13' +
            '&chxl=1:';

        kmapAllAdminAreas = config.allAdminAreas;

        initializeDraggables();
        map = createMap(config);
        parseJsonToGmap(config.boundariesFilename, config.dataFiles, geographicAreaNames, labels, areaGPolygons, resetIndicators);
        $('#kmapTitle').html(config.title);
        $('#nationalaveragelabel').html(config.allAdminAreas + ':');
    });
});
function initializeDraggables() {
    // plugin uses with() construct
    // TODO replace with https://www.npmjs.com/package/draggable
    const dragResize = new DragResize('dragresize', {allow_resize: false, minLeft: 350, minTop: 40});


    dragResize.isElement = function (elm) {
        return !!(elm.className && ~elm.className.indexOf('drsElement'));
    };
    dragResize.isHandle = function (elm) {
        return !!(elm.className && ~elm.className.indexOf('drsMoveHandle'));
    };

    dragResize.apply(document);
}
$(function () {
    let indicator;
    $.address.externalChange(function (event) {
        const newindicator = $.address.parameter('indicator');
        if (indicator !== newindicator) {
            indicator = newindicator;
            showByIndicator(indicator, indicatorsToUpdateParams);
        }
   });
});
