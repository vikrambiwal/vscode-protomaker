var path = require('path');
var fs = require('fs');

var basePath = '';
var moduleName = '';

function searchIn(fullPath, options) {
	search(fullPath, options);
}

function search(dir, fileName) {
	const allPath = dir.split('node_modules');
	basePath = allPath[0];
	const dict = allPath[1].split('/');
	moduleName = dict[1];

	createProto(dir, fileName);
}

function createModuleName(moduleName) {
	var mn = '';
	moduleName.split('-').forEach(i => {
		mn = mn + i.charAt(0);
	});
	return mn.toUpperCase();
}

function createProto(file, fileName) {
	const basename = path
		.basename(file)
		.split('.')
		.slice(0, -1)
		.join('.');

	if (fileName == basename) {
		const fullModule = moduleName;
		var dirname = path.dirname(file);
		var arrPaths = dirname.split('/');

		if (arrPaths.length > 1) {
			arrPaths.splice(0, arrPaths.indexOf('src') + 1);
		}
		dirname = ['src', 'protos', createModuleName(moduleName), ...arrPaths].join('/');
		var fPath = basePath;
		dirname.split('/').forEach(item => {
			fPath = fPath + item + '/';
			makeDirSync(fPath);
		});

		const content = 'import { ' + fileName + " } from '" + fullModule + "';";
		if (!checkImportExists(fPath + fileName + '.proto.js', content)) {
			fs.appendFile(fPath + fileName + '.proto.js', '\n' + content, function(err) {
				if (err) throw err;
			});
		}

		importNested(fullModule, dirname, fileName);
	}
}

function importNested(module, dirname, fileName) {
	const content = "import './" + fileName + ".proto';";
	if (!checkImportExists(basePath + dirname + '/index.js', content)) {
		fs.appendFile(basePath + dirname + '/index.js', '\n' + content, function(err) {
			if (err) throw err;
			console.log('Saved!');
		});
	}

	var path = basePath + dirname;
	dirname
		.split('/')
		.reverse()
		.forEach(i => {
			path = path
				.split('/')
				.slice(0, -1)
				.join('/');
			if (i == 'src') {
				return;
			}
			const content = "import './" + i + "';";
			if (!checkImportExists(path + '/index.js', content)) {
				fs.appendFile(path + '/index.js', '\n' + content, function(err) {
					if (err) throw err;
					console.log('Saved!');
				});
			}
		});
}

function makeDirSync(dir) {
	if (fs.existsSync(dir)) return;
	if (!fs.existsSync(path.dirname(dir))) {
		makeDirSync(path.dirname(dir));
	}
	fs.mkdirSync(dir);
}

function checkImportExists(path, content) {
	var exist = false;

	if (fs.existsSync(path)) {
		fs.readFileSync(path, 'utf-8')
			.split(/\r?\n/)
			.forEach(function(line) {
				if (content == line) {
					exist = true;
				}
			});
	}

	return exist;
}

module.exports = {
	searchIn
};
