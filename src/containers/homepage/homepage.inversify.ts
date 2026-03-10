import {Container} from 'inversify';
import {HomePage} from '@pages/homepage';
import {IHomePage} from '@interfaces/pages/HomePage';
import { HOME_PAGE } from './Homepage.symbols';

export const container = new Container();

container.bind<IHomePage>(HOME_PAGE.HomePage).to(HomePage);