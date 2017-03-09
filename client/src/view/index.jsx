import React from 'react';
import {render} from 'react-dom';

import HelloWorld from './components/Test/HelloWorld.jsx';

//Use skeleton boilerplate
import './shared_styles/skeleton.less'

render(<HelloWorld/>, document.getElementById('app'));