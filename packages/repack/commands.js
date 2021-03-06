const path = require('path');
const { createRequire } = require('module');

function getReactNativeCliPath() {
  let cliPath;

  try {
    cliPath = path.dirname(require.resolve('@react-native-community/cli'));
  } catch {
    // NOOP
  }

  try {
    cliPath = path.dirname(
      require.resolve('react-native/node_modules/@react-native-community/cli')
    );
  } catch {
    // NOOP
  }

  try {
    const rnRequire = createRequire(require.resolve('react-native'));
    cliPath = path.dirname(rnRequire.resolve('@react-native-community/cli'));
  } catch {
    // NOOP
  }

  if (!cliPath) {
    throw new Error('Cannot resolve @react-native-community/cli package');
  }

  return cliPath;
}

const {
  projectCommands: cliCommands,
} = require(`${getReactNativeCliPath()}/commands`);

const startCommand = cliCommands.find((command) => command.name === 'start');

// transform required to optinal
const startCommandOptions = startCommand.options.map(({ name, ...rest }) => {
  return {
    name: name.replace('<', '[').replace('>', ']'),
    ...rest,
  };
});

const bundleCommand = cliCommands.find((command) => command.name === 'bundle');

// transform required to optinal
const bundleCommandOptions = bundleCommand.options.map(({ name, ...rest }) => {
  return {
    name: name.replace('<', '[').replace('>', ']'),
    ...rest,
  };
});

const webpackConfigOption = {
  name: '--webpackConfig [path]',
  description: 'Path to a Webpack config',
  parse: (val) => path.resolve(val),
  default: (config) => {
    const {
      getWebpackConfigPath,
    } = require('./dist/commands/utils/getWebpackConfigOutterPath');

    try {
      return getWebpackConfigPath(config.root);
    } catch {
      return '';
    }
  },
};

module.exports = [
  {
    name: 'webpack-bundle',
    description: bundleCommand.description,
    options: bundleCommandOptions.concat(
      {
        name: '--verbose',
        description: 'Enables verbose logging',
      },
      webpackConfigOption
    ),
    func: require('./dist/commands/bundle').bundle,
  },
  {
    name: 'webpack-start',
    options: startCommandOptions.concat(webpackConfigOption),
    description: startCommand.description,
    func: require('./dist/commands/start').start,
  },
];
