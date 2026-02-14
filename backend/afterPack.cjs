const path = require('path');
const { rcedit } = require('rcedit');

exports.default = async function afterPack(context) {
	const exePath = path.join(
		context.appOutDir,
		`${context.packager.appInfo.productFilename}.exe`
	);
	const iconPath = path.join(__dirname, 'build-resources', 'icon.ico');

	console.log('Replacing icon in:', exePath);
	console.log('With icon:', iconPath);

	try {
		await rcedit(exePath, { icon: iconPath });
		console.log('Icon replaced successfully!');
	} catch (err) {
		console.error('Failed to replace icon:', err.message);
	}
};