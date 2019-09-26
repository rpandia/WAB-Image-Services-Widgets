///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'esri/SpatialReference',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'jimu/BaseWidget',
    'dojo/_base/lang',
    "dojo/_base/array",
    "dojo/date/locale",
    "dojo/html",
    "dojo/promise/all",
    "esri/request",
    "esri/layers/MosaicRule",
    "esri/graphic"
],
        function (
                declare,
                _WidgetsInTemplateMixin,
                SpatialReference,
                Query,
                QueryTask,
                BaseWidget,
                lang,
                array,
                locale,
                html,
                all,
                esriRequest, MosaicRule) {
            var clazz = declare([BaseWidget, _WidgetsInTemplateMixin], {
                baseClass: 'jimu-widget-ISImageDate',
                name: 'ISImageDate',
                requestCount: 0,
                rstVar: '',
                primaryLayer: null,
                postCreate: function () {
                    this.layerInfos = this.config;
                    if (this.map.layerIds) {
                        this.setPrimaryLayer();
                        this.map.on("update-start", lang.hitch(this, this.setPrimaryLayer));
                        this.map.on("update-end", lang.hitch(this, this.setPrimaryLayer));
                        this.map.on("layer-reorder", lang.hitch(this, this.setPrimaryLayer));
                        if (this.primaryLayer) {
                            this.primaryLayer.on("visibility-change", lang.hitch(this, this.setPrimaryLayer));
                        }
                    }

                },
                getResults: function (title,layer, point, mosaicRule,dtField) {
							//console.log("title inside function = "+"  "+title);
							/*var lyrNameStr = "";
							for (var a in this.map.layerIds) {
								if (this.map.getLayer(this.map.layerIds[a]).visible) {
									if (this.map.getLayer(this.map.layerIds[a]).type === 'ArcGISImageServiceLayer' || (this.map.getLayer(this.map.layerIds[a]).serviceDataType && this.map.getLayer(this.map.layerIds[a]).serviceDataType.substr(0, 16) === "esriImageService")) {
										var title = (this.map.getLayer(this.map.layerIds[a])).arcgisProps ? (this.map.getLayer(this.map.layerIds[a])).arcgisProps.title : "";
										kk = lyrNameStr;
										lyrNameStr =  title+"$"+kk;
							}}}	*/
                            var request = this.getSamples(layer, point, mosaicRule,dtField);
                            request.then(lang.hitch(this, function (result) {
                            if (result.samples.length > 0) {
                                var RstprimaryDate = result.samples[0].attributes[dtField];
                                this.primaryDate = locale.format(new Date(RstprimaryDate), {selector: "date", formatLength: "long"});
                                //console.log("witout this "+title);
                                pp = title+" Date : "+this.primaryDate+" <br/>";
								if((this.rstVar).indexOf(pp) == -1){
								if((this.rstVar).search(title) == -1){
                                var kk = pp + this.rstVar;
                                this.rstVar = kk;
                                console.log("witout this >>>>>"+this.rstVar);
                                html.set(this.primaryName,this.rstVar);
								
								/*this.rstVar = this.rstVar+""+title+" Date : "+this.primaryDate+" <br/>";
                                //console.log("witout this >>>>>"+this.rstVar);
                                html.set(this.primaryName,this.rstVar);*/
								
                                }else{
									var left_text = (this.rstVar).indexOf(title+" Date : ");
									console.log((this.rstVar)+" "+left_text+" "+Rt_text+" pp ="+pp);
							}}
								}}));},
                setPrimaryLayer: function () {
                    /*if (this.map.primaryLayer && this.map.getLayer(this.map.primaryLayer).visible) {
                        this.primaryLayer = this.map.getLayer(this.map.primaryLayer);
                        if (document.getElementById("swipewidget")) {
                            if (this.map.secondaryLayer && this.map.getLayer(this.map.secondaryLayer).visible) {
                                this.secondaryLayer = this.map.getLayer(this.map.secondaryLayer);
                            }
                        } else
                            this.secondaryLayer = null;
                    } else if (this.map.secondaryLayer && this.map.getLayer(this.map.secondaryLayer).visible) {
                        this.primaryLayer = this.map.getLayer(this.map.secondaryLayer);
                        this.secondaryLayer = null;
                    } else {
                        for (var a = this.map.layerIds.length - 1; a >= 0; a--) {
                            var layerObject = this.map.getLayer(this.map.layerIds[a]);
                            var title = layerObject.arcgisProps && layerObject.arcgisProps.title ? layerObject.arcgisProps.title : layerObject.title;
                            if (layerObject && layerObject.visible && layerObject.serviceDataType && layerObject.serviceDataType.substr(0, 16) === "esriImageService" && layerObject.id !== "resultLayer" && layerObject.id !== "scatterResultLayer" && layerObject.id !== this.map.resultLayer && (!title || ((title).charAt(title.length - 1)) !== "_")) {
                                this.primaryLayer = layerObject;
                                break;
                            } else
                                this.primaryLayer = null;
                        }
                        if (document.getElementById("swipewidget")) {
                            for (var a = this.map.layerIds.length - 1; a >= 0; a--) {
                                var layerObject = this.map.getLayer(this.map.layerIds[a]);
                                var title = layerObject.arcgisProps && layerObject.arcgisProps.title ? layerObject.arcgisProps.title : layerObject.title;
                                if (layerObject && layerObject.id !== this.primaryLayer.id && layerObject.visible && layerObject.serviceDataType && layerObject.serviceDataType.substr(0, 16) === "esriImageService" && layerObject.id !== "resultLayer" && layerObject.id !== "scatterResultLayer" && layerObject.id !== this.map.resultLayer && (!title || ((title).charAt(title.length - 1)) !== "_")) {
                                    this.secondaryLayer = layerObject;
                                    break;
                                } else
                                    this.secondaryLayer = null;
                            }
                        }else
                            this.secondaryLayer = null;
                    }*/
                    this.clearDateRange();
                    var primaryName = this.primaryName;
                    var sringVal = '<br/>';
                    for (var a in this.map.layerIds) {
                        if (this.map.getLayer(this.map.layerIds[a]).visible) {
                        if (this.map.getLayer(this.map.layerIds[a]).type === 'ArcGISImageServiceLayer' || (this.map.getLayer(this.map.layerIds[a]).serviceDataType && this.map.getLayer(this.map.layerIds[a]).serviceDataType.substr(0, 16) === "esriImageService")) {
                            var title = (this.map.getLayer(this.map.layerIds[a])).arcgisProps ? (this.map.getLayer(this.map.layerIds[a])).arcgisProps.title : "";
                            //console.log("title inside loop = "+"  "+title);
                            this.label = this.map.getLayer(this.map.layerIds[a]).url.split('//')[1];
                            var layer = this.map.getLayer(this.map.layerIds[a]);
                            var point = this.map.extent.getCenter();
                            var mosaicRule = layer.mosaicRule ? layer.mosaicRule : "";
                            var dtField = this.layerInfos[this.label].dateField;
							this.getResults(title,layer, point, mosaicRule,dtField);
                    }
                    }}
                    },
                onOpen: function () {
                    if (this.map.layerIds) {
                        this.clearDateRange();
                        this.setPrimaryLayer();
                    }
                },
                clearDateRange: function () {
                    this.rstVar = '';
                    html.set(this.primaryName, '');
                },
        getSamples: function (layer, point, mosaicRule, dateField) {
            return new esriRequest({
                        url: layer.url + "/getSamples",
                        content: {
                            f: "json",
                            geometry: JSON.stringify(point),
                            geometryType: "esriGeometryPoint",
                            returnGeometry: false,
                            mosaicRule: mosaicRule ? JSON.stringify(mosaicRule.toJson()) : mosaicRule,
                            returnFirstValueOnly: true,
                            outFields: dateField
                        },
                        handleAs: "json",
                        callbackParamName: "callback"
                    });
        },
                primarydate: function ()
                {
                    if (this.dateField) {
                        var layer = this.primaryLayer;
                        var point = this.map.extent.getCenter();
                        var mosaicRule = layer.mosaicRule ? layer.mosaicRule : "";
                        var request = this.getSamples(layer, point, mosaicRule, this.dateField);

                        request.then(lang.hitch(this, function (result) {
                            if (result.samples.length > 0) {
                                var primaryDate = result.samples[0].attributes[this.dateField];
                                if (this.secondaryLayer) {
                                    var mosaicRule = this.secondaryLayer.mosaicRule ? this.secondaryLayer.mosaicRule : "";
                                    var requestSecondary = this.getSamples(this.secondaryLayer, point, mosaicRule, this.secondaryDateField)

                                    requestSecondary.then(lang.hitch(this, function (data) {
                                        if (data.samples.length > 0) {
                                            var secondaryDate = data.samples[0].attributes[this.secondaryDateField];
                                            html.set(this.primaryDate, locale.format(new Date(secondaryDate), {selector: "date", formatLength: "long"}) + " vs " + locale.format(new Date(primaryDate), {selector: "date", formatLength: "long"}));
                                        } else {
                                            var secondaryDate = null;
                                            html.set(this.primaryDate, locale.format(new Date(primaryDate), {selector: "date", formatLength: "long"}));
                                        }
                                    }));
                                } else {
                    var dateString = locale.format(new Date(primaryDate), {selector: "date", formatLength: "long"});
                    //console.log(dateString);
                    if (dateString !== "December 31, 1969" && dateString !== "January 1, 1970") {
                    html.set(this.primaryDate, dateString);
                    }
                    else {
                    html.set(this.primaryDate, "");
                    }
                                }
                            } else {
                                html.set(this.primaryDate, "");
                }
                        }), lang.hitch(this, function (error) {
                            html.set(this.primaryDate, "");
                //console.warn("Primary date not found");
                let searching = true;
                for (var a = this.map.layerIds.length - 1; a >= 0 && searching; a--) {
                var layerObject = this.map.getLayer(this.map.layerIds[a]);
                var title = layerObject.arcgisProps && layerObject.arcgisProps.title ? layerObject.arcgisProps.title : layerObject.title;
                if (layerObject &&
                    layerObject.visible &&
                    layerObject.serviceDataType &&
                    layerObject.serviceDataType.substr(0, 16) === "esriImageService"
                    && layerObject.id !== "resultLayer"
                    && layerObject.id !== "scatterResultLayer"
                    && layerObject.id !== this.map.resultLayer
                    && (!title || ((title).charAt(title.length - 1)) !== "_")) {
                    //console.log(layerObject);

                    // Query the current layer for a date
                    var layer = layerObject;
                    var point = this.map.extent.getCenter();
                    var mosaicRule = layer.mosaicRule ? layer.mosaicRule : "";
                    var request = this.getSamples(layer, point, mosaicRule, this.dateField);
                    request.then(lang.hitch(this, function (result) {
                    if (result.samples.length > 0) {
                        var primaryDate = result.samples[0].attributes[this.dateField];
                        var dateString = locale.format(new Date(primaryDate), {selector: "date", formatLength: "long"});
                        //console.log(dateString);
                        if (dateString !== "December 31, 1969" && dateString !== "January 1, 1970") {
                        html.set(this.primaryDate, dateString);
                        searching = false;
                        }
                    }
                    }),lang.hitch(this, function (error) {
                    html.set(this.primaryDate, '');
                    }));
                }
                }
                if (searching) {
                html.set(this.primaryDate, '');
                }

                        }));


                    } else {
                        html.set(this.primaryDate, '');
                    }
                },
                changeDateRange: function () {
                    this.setPrimaryLayer();
                    if (this.primaryLayer) {
                        this.label = this.primaryLayer.url.split('//')[1];

                        if (this.previousPrimary !== this.primaryLayer) {
                            this.primaryLayer.on("visibility-change", lang.hitch(this, this.changeDateRange));
                        }

                        if (this.primaryLayer && this.primaryLayer.visible) {
                            if (this.layerInfos[this.label]) {
                                this.dateField = this.layerInfos[this.label].dateField;
                                if (this.secondaryLayer)
                                    this.getSecondaryDateField();
                                else {
                                    this.primarydate();
                }
                            } else {
                                var obj = {};
                                if (this.primaryLayer.timeInfo && this.primaryLayer.timeInfo.startTimeField) {
                                    var timeInfo = this.primaryLayer.timeInfo;
                                    var field = timeInfo.startTimeField;
                                    if (field) {
                                        this.dateField = field;
                                        obj.dateField = field;
                                    } else {
                                        this.dateField = null;
                                        obj.dateField = null;
                                    }
                                    if (this.secondaryLayer)
                                        this.getSecondaryDateField();
                                    else
                                        this.primarydate();
                                } else {
                                    var layersRequest = esriRequest({
                                        url: this.primaryLayer.url,
                                        content: {f: "json"},
                                        handleAs: "json",
                                        callbackParamName: "callback"
                                    });
                                    layersRequest.then(lang.hitch(this, function (data) {
                                        var timeInfo = data.timeInfo;
                                        if (timeInfo) {
                                            var field = timeInfo.startTimeField;
                                            if (field) {
                                                this.dateField = field;
                                                obj.dateField = field;
                                            } else {
                                                var regExp = new RegExp(/acq[a-z]*[_]?Date/i);
                                                for (var i in data.fields) {
                                                    if (regExp.test(data.fields[i].name)) {
                                                        this.dateField = data.fields[i].name;
                                                        obj.dateField = data.fields[i].name;
                                                        break;
                                                    } else if (data.fields[i].type === "esriFieldTypeDate") {
                                                        this.dateField = data.fields[i].name;
                                                        obj.dateField = data.fields[i].name;
                                                        break;
                                                    }
                                                    this.dateField = null;
                                                    obj.dateField = null;
                                                }
                                            }
                                        } else {
                                            var regExp = new RegExp(/acq[a-z]*[_]?Date/i);
                                            for (var i in data.fields) {
                                                if (regExp.test(data.fields[i].name)) {
                                                    this.dateField = data.fields[i].name;
                                                    obj.dateField = data.fields[i].name;
                                                    break;
                                                } else if (data.fields[i].type === "esriFieldTypeDate") {
                                                    this.dateField = data.fields[i].name;
                                                    obj.dateField = data.fields[i].name;
                                                    break;
                                                }
                                                this.dateField = null;
                                                obj.dateField = null;
                                            }
                                        }
                                        if (this.secondaryLayer)
                                            this.getSecondaryDateField();
                                        else
                                            this.primarydate();
                                    }));
                                }
                                this.layerInfos[this.label] = obj;
                            }

                        } else {
                            html.set(this.primaryDate, '');
                        }
                    }
                },
                getSecondaryDateField: function () {
                    var label = this.secondaryLayer.url.split('//')[1];
                    ;

                    if (this.layerInfos[label]) {
                        this.secondaryDateField = this.layerInfos[label].dateField;
                        this.primarydate();
                    } else {
                        var obj = {};
                        if (this.secondaryLayer.timeInfo && this.secondaryLayer.timeInfo.startTimeField) {
                            var timeInfo = this.secondaryLayer.timeInfo;
                            var field = timeInfo.startTimeField;
                            if (field) {
                                this.secondaryDateField = field;
                                obj.dateField = field;
                            } else {
                                this.secondaryDateField = null;
                                obj.dateField = null;
                            }
                            this.primarydate();
                        } else {
                            var layersRequest = esriRequest({
                                url: this.secondaryLayer.url,
                                content: {f: "json"},
                                handleAs: "json",
                                callbackParamName: "callback"
                            });
                            layersRequest.then(lang.hitch(this, function (data) {
                                var timeInfo = data.timeInfo;
                                if (timeInfo) {
                                    var field = timeInfo.startTimeField;
                                    if (field) {
                                        this.secondaryDateField = field;
                                        obj.dateField = field;
                                    } else {
                                        var regExp = new RegExp(/acq[a-z]*[_]?Date/i);
                                        for (var i in data.fields) {
                                            if (regExp.test(data.fields[i].name)) {
                                                this.secondaryDateField = data.fields[i].name;
                                                obj.dateField = data.fields[i].name;
                                                break;
                                            } else if (data.fields[i].type === "esriFieldTypeDate") {
                                                this.secondaryDateField = data.fields[i].name;
                                                obj.dateField = data.fields[i].name;
                                                break;
                                            }
                                            this.secondaryDateField = null;
                                            obj.dateField = null;
                                        }
                                    }
                                } else {
                                    var regExp = new RegExp(/acq[a-z]*[_]?Date/i);
                                    for (var i in data.fields) {
                                        if (regExp.test(data.fields[i].name)) {
                                            this.secondaryDateField = data.fields[i].name;
                                            obj.dateField = data.fields[i].name;
                                            break;
                                        } else if (data.fields[i].type === "esriFieldTypeDate") {
                                            this.secondaryDateField = data.fields[i].name;
                                            obj.dateField = data.fields[i].name;
                                            break;
                                        }
                                        this.secondaryDateField = null;
                                        obj.dateField = null;
                                    }
                                }

                                this.primarydate();
                            }));
                        }
                    }
                }

            });

            clazz.hasLocale = false;
            clazz.hasSettingPage = true;
            clazz.hasSettingUIFile = true;
            clazz.hasSettingLocale = false;
            clazz.hasSettingStyle = true;
            clazz.inPanel = false;
            return clazz;
        });
