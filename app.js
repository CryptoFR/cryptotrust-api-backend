/*jslint node: true, nomen: true, regexp: true, plusplus: true */
(function () {

    "use strict";

    const express           = require("express"),
          logger            = require("morgan"),
          bodyParser        = require("body-parser"),

          api               = require("./app/routes/api"),
          conf              = require("./app/modules/conf"),
          dbInit            = require("./app/modules/db"),

          app               = express();

    dbInit(conf);

    app.use(logger("dev"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use("/", api);

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new Error("Not Found");
        err.status = 404;
        next(err);
    });

    // error handler
    app.use((err, req, res, next) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    module.exports = app;

})();