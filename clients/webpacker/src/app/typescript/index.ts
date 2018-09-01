import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { createHash } from 'crypto';
import * as ts from 'typescript';

const md5 = createHash('md5');
const file = join(__dirname, 'imeepos.json');
if (!existsSync(file)) {
    mkdirSync(dirname(file));
}
class ImeeposData {
    // 文件版本号
    version: string = '1.0';
    // 文件包名
    package: string = 'nestpack';
    // 文件名称
    filename: string = './index.ts';
    // 行号
    pos: number = 1;
    // 列号
    col: number = 2;
}
class ImeeposContent {
    id: string;
    content: string;
    // 文件目录
    require: string;
    // 导出对象
    exports: string[];
    meta: ImeeposData;
}
const data = new ImeeposData();
// 写入数据库
const content = new ImeeposContent();
content.id = md5.update(JSON.stringify(data)).digest('hex');
content.meta = data;
content.content = readFileSync(data.filename).toString();
content.require = join(data.package, data.filename);
content.exports = ['default'];

const options = JSON.parse(readFileSync(join(__dirname, 'src/tsconfig.json')).toString());
const host = ts.createCompilerHost(options);
const sourceFile = host.getSourceFile(join(__dirname, 'src/test2.ts'), ts.ScriptTarget.ES5);
sourceFile.forEachChild((node: ts.Node) => {
    console.log(`
        ${node.pos}-${node.end}
        ${node.flags}
        ${node.decorators}
        ${node.modifiers}
        ${
        getNodeType(node.kind)
        }
        ${
        node.getText(sourceFile)
        }
        `);
})
ts.ScriptKind
writeFileSync(file, JSON.stringify(content, null, 2))


function getNodeType(kind: number) {
    for (let key in ts.SyntaxKind) {
        if (key === kind + '') {
            return ts.SyntaxKind[key];
        }
    }
}
