/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports WcsTileUrlBuilder
 */
define([
        '../error/ArgumentError',
        '../util/Logger'
    ],
    function (ArgumentError,
              Logger) {
        "use strict";

        /**
         * Constructs a WCS tile URL builder.
         * @alias WcsTileUrlBuilder
         * @constructor
         * @classdesc Provides a factory to create URLs for WCS Get Coverage requests.
         * @param {String} serviceAddress The address of the WCS server.
         * @param {String} coverageName The name of the coverage to retrieve.
         * @param {String} wcsVersion The version of the WCS server. May be null, in which case version 1.0.0 is
         * assumed.
         * @constructor
         * @deprecated
         */
        var WcsTileUrlBuilder = function (serviceAddress, coverageName, wcsVersion) {
            if (!serviceAddress || (serviceAddress.length === 0)) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsTileUrlBuilder", "constructor",
                        "The WCS service address is missing."));
            }

            if (!coverageName || (coverageName.length === 0)) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsTileUrlBuilder", "constructor",
                        "The WCS coverage name is missing."));
            }

            /**
             * The address of the WCS server.
             * @type {String}
             */
            this.serviceAddress = serviceAddress;

            /**
             * The name of the coverage to retrieve.
             * @type {String}
             */
            this.coverageName = coverageName;

            /**
             * The WCS version to specify when requesting resources.
             * @type {String}
             * @default 1.0.0
             */
            this.wcsVersion = (wcsVersion && wcsVersion.length > 0) ? wcsVersion : "1.0.0";

            /**
             * The coordinate reference system to use when requesting coverages.
             * @type {String}
             * @default EPSG:4326
             */
            this.crs = "EPSG:4326";
        };

        /**
         * Creates the URL string for a WCS Get Coverage request.
         * @param {Tile} tile The tile for which to create the URL.
         * @param {String} coverageFormat The coverage format to request.
         * @throws {ArgumentError} If the specified tile or coverage format are null or undefined.
         */
        WcsTileUrlBuilder.prototype.urlForTile = function (tile, coverageFormat) {

            if (!tile) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsUrlBuilder", "urlForTile", "missingTile"));
            }

            if (!coverageFormat) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsUrlBuilder", "urlForTile",
                        "The coverage format is null or undefined."));
            }

            var requestUrl = WcsTileUrlBuilder.fixGetCoverageString(this.serviceAddress);

            if (requestUrl.search(/service=wcs/i) < 0) {
                requestUrl += "SERVICE=WCS";
            }

            requestUrl += "&REQUEST=GetCoverage";
            requestUrl += "&VERSION=" + this.wcsVersion;
            requestUrl += "&FORMAT=" + coverageFormat;

            if (this.wcsVersion === "1.0.0") {
                return this.buildUrl100(tile, requestUrl);
            } else if (this.wcsVersion === "2.0.1" || this.wcsVersion === "2.0.0") {
                return this.buildUrl20x(tile, requestUrl);
            }
        };

        // Internal use only
        WcsTileUrlBuilder.prototype.buildUrl100 = function (tile, requestUrl) {
            var sector = tile.sector;

            requestUrl += "&COVERAGE=" + this.coverageName;
            requestUrl += "&CRS=" + this.crs;
            requestUrl += "&WIDTH=" + tile.tileWidth;
            requestUrl += "&HEIGHT=" + tile.tileHeight;
            requestUrl += "&BBOX=" + sector.minLongitude + "," + sector.minLatitude + "," + sector.maxLongitude + "," + sector.maxLatitude;

            return encodeURI(requestUrl);
        };

        // Internal use only
        WcsTileUrlBuilder.prototype.buildUrl20x = function (tile, requestUrl) {
            var sector = tile.sector;

            requestUrl += "&coverageId=" + this.coverageName;
            requestUrl += "&outputCRS=http://www.opengis.net/def/crs/EPSG/0/4326";
            requestUrl += "&size=x(" + tile.tileWidth + ")";
            requestUrl += "&size=y(" + tile.tileHeight + ")";
            requestUrl += "&subset=x,http://www.opengis.net/def/crs/EPSG/0/4326(" + sector.minLongitude + "," + sector.maxLongitude + ")";
            requestUrl += "&subset=y,http://www.opengis.net/def/crs/EPSG/0/4326(" + sector.minLatitude + "," + sector.maxLatitude + ")";

            return encodeURI(requestUrl);
        };

        // Intentionally not documented.
        WcsTileUrlBuilder.fixGetCoverageString = function (serviceAddress) {
            if (!serviceAddress) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsTileUrlBuilder", "fixGetCoverageString",
                        "The specified service address is null or undefined."));
            }

            var index = serviceAddress.indexOf("?");

            if (index < 0) { // if string contains no question mark
                serviceAddress = serviceAddress + "?"; // add one
            } else if (index !== serviceAddress.length - 1) { // else if question mark not at end of string
                index = serviceAddress.search(/&$/);
                if (index < 0) {
                    serviceAddress = serviceAddress + "&"; // add a parameter separator
                }
            }

            return serviceAddress;
        };

        return WcsTileUrlBuilder;
    });
