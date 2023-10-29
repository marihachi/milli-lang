# milli-lang
A toy language made with TypeScript.  
We execute a code by compiling it for the VM.

## Installation
Linux or Windows(WSL) supported.

```
$ npm i
$ npm run build
```

## Usage

source file: `*.mil`
bytecode file: `*.mbc`
assembly file: `*.asm`

Compile a milli-lang source(.mil) to a bytecode file(.mbc):
```
$ npm run compile
```

Run a bytecode file(.mbc):
```
$ npm run start
```

### Assemble

Assemble an assembly text(.asm) to a bytecode file(.mbc):
```
$ npm run asm
```

Disassemble a bytecode file(.mbc) to an assembly text(.asm):
```
$ npm run disasm
```

## License
MIT
