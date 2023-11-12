import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { faCoffee } from '@fortawesome/free-solid-svg-icons';

library.add(faCoffee);

export default (app: any) => {
  app.component('font-awesome-icon', FontAwesomeIcon);
};