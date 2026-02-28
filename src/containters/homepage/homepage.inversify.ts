import {Container} from 'inversify';
import {HomePage} from '@pages/homepage';
import {IHomePage} from '@interfaces/HomePage';

export const container = new Container();

container.bind<IHomePage>(HomePage).to(HomePage);