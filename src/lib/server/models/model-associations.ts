import ApplicationModel from '$lib/server/models/application-model';
import LicenseModel from '$lib/server/models/license-model';
import UserModel from '$lib/server/models/user-model';

ApplicationModel.hasMany(LicenseModel);
LicenseModel.belongsTo(ApplicationModel, { as: 'application' });
UserModel.belongsToMany(LicenseModel, { through: 'UserLicense' });
LicenseModel.belongsToMany(UserModel, { through: 'UserLicense' });
