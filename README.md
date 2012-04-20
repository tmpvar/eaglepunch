# install

    git clone https://github.com/tmpvar/eaglepunch.git
    cd eaglepunch
    npm install

point eagle at that directory by..

Switch to the `Control Panel` and open `Options->Directories` dialog

<img src="http://imgur.com/H1Ypw.png" border = "1"/>

Add the `eaglepunch` directory

<img src="http://imgur.com/ITliX.png" border = "1"/>

press ok, and now you are ready to punch the eagle!

# running

Open your board file, and type in the command `run eaglepunch`

<img src="http://imgur.com/UMEG5.png" border="1" />

it should show that it finished

<img src="http://imgur.com/xZdvZ.png" border="1" />

now you should have a `from-eagle` file in the `eaglepunch` directory.

it looks something like this:

<img src="http://imgur.com/oo9O2.png" border="1" />

to turn this into json run `node eaglepunch/toJSON.js`

# future


That is all for now, but in the near future you can expect things like:

 * generate gcode for milling stencils
 * automatic toJSON conversion
 * some way to execute a chain of commands.  Personally I'd love to be able to `run eaglepunch` while hooked up to a grbl controlled cnc machine and it immediately starts milling.
