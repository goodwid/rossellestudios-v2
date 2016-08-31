import angular from 'angular';
import app from './rosselle';
import './scss/main.scss';
import routes from './routes';
import http from './http';
import auth from './auth';

app.config(http);
app.config(routes);

app.value( 'apiUrl', 'http://localhost:9000/api');


app.run(auth);

angular.bootstrap(document, [app.name]);
