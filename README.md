<img src="https://worldwind.arc.nasa.gov/img/nasa-logo.svg" height="100"/>
<p>in partnership with the <a href="http://www.esa.int" target="_blank">European Space Agency</a></p>

# Web WorldWind

[![Build Status](https://travis-ci.org/NASAWorldWind/WebWorldWind.svg?branch=develop)](https://travis-ci.org/NASAWorldWind/WebWorldWind)

3D virtual globe API for JavaScript, developed by NASA in partnership with ESA. Provides a geographic context, complete with terrain, 
for visualizing geographic or geo-located information in 3D and 2D. Web WorldWind provides high-resolution terrain and 
imagery, retrieved from remote servers automatically as needed. Developers can provide custom terrain and imagery.
Provides a collection of shapes for displaying and interacting with geographic data and representing a range of 
geometric objects.   

- [worldwind.arc.nasa.gov](https://worldwind.arc.nasa.gov) has setup instructions, developers guides, API documentation and more
- [Forum](https://forum.worldwindcentral.com) provides help from the WorldWind community
- [WebStorm](https://www.jetbrains.com/webstorm) is used by the NASA WorldWind development team

## Get Started

The Web WorldWind [Developer's Guide](https://worldwind.arc.nasa.gov/web) has a complete description of Web 
WorldWind's functionality. You'll also find there links to many Web WorldWind resources, including a user guide. The 
latest Web WorldWind release provides many simple examples showing how to use all of Web WorldWind's functionality.

## Building

[Install NodeJS](https://nodejs.org). The build is known to work with v6.9.2 (LTS).

- `npm install` downloads WorldWind's dependencies

- `npm run build` builds everything

- `npm run doc` generates the WorldWind API documentation

- `npm run test` runs WorldWind's unit tests

- `npm run test:watch` automatically runs WorldWind's unit tests when source code changes

## License

    NASA WorldWind

    Copyright (C) 2001 United States Government
    as represented by the Administrator of the
    National Aeronautics and Space Administration.
    All Rights Reserved.

    NASA OPEN SOURCE AGREEMENT VERSION 1.3

    This open source agreement ("agreement") defines the rights of use, reproduction,
    distribution, modification and redistribution of certain computer software originally
    released by the United States Government as represented by the Government Agency
    listed below ("Government Agency"). The United States Government, as represented by
    Government Agency, is an intended third-party beneficiary of all subsequent
    distributions or redistributions of the subject software. Anyone who uses, reproduces,
    distributes, modifies or redistributes the subject software, as defined herein, or any
    part thereof, is, by that action, accepting in full the responsibilities and obligations 
    contained in this agreement.

    Government Agency: National Aeronautics and Space Administration (NASA)
    Government Agency Original Software Designation: ARC-15166-1
    Government Agency Original Software Title: NASA WorldWind
    User Registration Requested. Please send email with your contact information to Patrick.Hogan@nasa.gov
    Government Agency Point of Contact for Original Software: Patrick.Hogan@nasa.gov

    You may obtain a full copy of the license at:

        https://worldwind.arc.nasa.gov/LICENSE.html
