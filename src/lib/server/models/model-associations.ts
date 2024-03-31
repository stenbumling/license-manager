import Application from './application-model';
import License from './license-model';
import User from './user-model';

Application.hasMany(License);
License.belongsTo(Application, { as: 'application' });
User.belongsToMany(License, { through: 'UserLicense' });
License.belongsToMany(User, { through: 'UserLicense' });
