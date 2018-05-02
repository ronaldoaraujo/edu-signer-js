import {join} from 'path'

export default {
  mode: 'production',
  output: {
    path: join(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'EduSigner',
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' }
    ]
  }
}
