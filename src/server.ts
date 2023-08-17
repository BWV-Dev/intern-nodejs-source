import './LoadEnv';
import * as bodyParser from "body-parser";
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import session from "express-session";
import favicon from "serve-favicon";
import errorHandler from "./middlewares/errorHandler";
import router from "./routes";
import * as moment from 'moment-timezone';
import './connection';

moment.tz.setDefault('Asia/Tokyo');

const app = express();

app.set("views", `${__dirname}/../views`);
app.set("view engine", "ejs");
app.use(expressEjsLayouts);
app.set("layout extractScripts", true);
app.set("layout", "layout/defaultLayout");
app.use(favicon(`${__dirname}/../public/favicon.ico`));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 10000 }));

app.use(
  session({
    secret: <string>process.env.SESSION_SECRET || "session_secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000
    }
  })
);

app.use(cookieParser());

app.use(express.static(`${__dirname}/../public`));
app.use(router);
app.use(errorHandler);
app.set('trust proxy', true);

export = app;