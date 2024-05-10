import ApplicationModel from './application-model';
import LicenseModel from './license-model';
import UserModel from './user-model';

ApplicationModel.hasMany(LicenseModel);
LicenseModel.belongsTo(ApplicationModel, { as: 'application' });
UserModel.belongsToMany(LicenseModel, { through: 'UserLicense' });
LicenseModel.belongsToMany(UserModel, { through: 'UserLicense' });
