# Bootstrap Blank

Bootstrap4 starter UI kit for rapid landing pages

## Notes

Bootstrap 4
Gulp

## Install

Yarn or npm install

then

yarn global add gulp-cli or npm install --global gulp-cli

Your millage may vary depending on your node version, 12.22.12 seems to be a good middle ground.

## Workflow

After you've installed and setup the tools, start your development instance then develop in your src folder and use the gulp tasks to build out the files to the appropriate folders in your installation. The outputed files should be nicely combined, minified and prod ready.

The vendor bundles are dragged from the node_modules in to a vendor folder in your build area then combined and built out in to our production area. This provides a nice staing point and allows you to check what you are piecing together in to the build.

## Usage

yarn build or npm build should run the build script.