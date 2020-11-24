# Orrery

Repository for the [Orrery web app](https://radio-orrery.web.app/).

## Documentation

Orrery is based on HTML Canvas, where it uses astronomical data and the Opencage geocoding API to generate a sliver of the sky above any point on earth. For the purposes of the app, it assumes moderate visibility and the sun being opposite the viewing angle. Powered by Google's Firebase and written in pure Javascript.

Basic usage:
1. Create an account
2. Open the locations modal and enter in any location. The Opencage API handles requests, and the app displays the found location and the night sky above it on screen.
3. Locations can be saved, which are stored in a database for each user. This way, specific searches can be easily recorded and accessed.
4. To log out, open the account modal and click "log out"

## Licenses

**Source** under MIT

**Content** licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
