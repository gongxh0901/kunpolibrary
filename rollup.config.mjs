import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
    {
        // 生成未压缩的 JS 文件
        input: 'src/kunpocc.ts',
        external: ['cc', 'fairygui-cc'],
        output: [
            {
                file: 'dist/kunpocc.mjs',
                format: 'esm',
                name: 'kunpocc'
            },
            {
                file: 'dist/kunpocc.cjs',
                format: 'cjs',
                name: 'kunpocc'
            }
        ],
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                importHelpers: false
            })
        ]
    },
    {
        // 生成压缩的 JS 文件
        input: 'src/kunpocc.ts',
        external: ['cc', 'fairygui-cc'],
        output: [
            {
                file: 'dist/kunpocc.min.mjs',
                format: 'esm',
                name: 'kunpocc'
            },
            {
                file: 'dist/kunpocc.min.cjs',
                format: 'cjs',
                name: 'kunpocc'
            }
        ],
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                importHelpers: false
            }),
            terser()
        ]
    },
    {
        // 生成声明文件的配置
        input: 'src/kunpocc.ts',
        output: {
            file: 'dist/kunpocc.d.ts',
            format: 'es'
        },
        plugins: [dts()]
    }
]; 