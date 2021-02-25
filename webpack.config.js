module.exports = {
 mode: 'development',
 entry: './src/index.ts',
 target: 'node',
 module: {
   rules: [
     {
       test: /\.ts$/,
       use: 'ts-loader',
     },
   ],
 },
 resolve: {
   extensions: [
     '.ts', '.js',
   ]
 },
};
