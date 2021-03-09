hljs.registerLanguage('dynasty', function (high) {
  const RESERVED_WORDS = [
    'if',
    'for',
    'while',
    'fn',
    'in',
    'type',
    'from',
    'import',
    'return',
    'continue',
    'break',
    'else',
    'var',
    'inv',
    'as',
  ];

  const BUILTIN_TYPES = [
    'int',
    'int8',
    'int16',
    'int32',
    'int64',
    'float',
    'float32',
    'float64',
    'string',
    'void',
  ];

  const BUILT_INS = ['str', 'stoi', 'stof', 'print'];

  const STRING = {
    contains: [high.BACKSLASH_ESCAPE],
    className: 'string',
    variants: [
      {
        begin: /"""/,
        end: /"""/,
        contains: [{}],
      },
      {
        begin: /"/,
        end: /"/,
      },
      {
        begin: /r"""/,
        end: /"""/,
      },
      {
        begin: /r"/,
        end: /"/,
      },
    ],
  };

  const NUMBER = {
    className: 'number',
    relevance: 0,
    variants: [
      {
        begin: /(?:(?:0|[1-9][_0-9]*)|0b[_01]|0[_0-7]+|0x[_0-9a-fA-F]+)(?:i(?:8|16|32|64))?/,
      },
      {
        begin: /([0-9][_0-9]*\\.[_0-9]*|\\.[_0-9]+)([eE][+-]?(0|[1-9][_0-9]*))?[fd]?/,
      },
    ],
  };

  const BLOCK_COMMENT = high.COMMENT(
    '#-', // begin
    '-#', // end
    { contains: [{ className: 'doc', begin: '@\\w+' }] }
  );
  const LINE_COMMENT = high.COMMENT(
    '#', // begin
    /$/ // end
  );

  return {
    name: 'Dynasty',
    aliases: ['dn'],
    case_insensitive: false,
    keywords: {
      keyword: RESERVED_WORDS,
      built_in: BUILT_INS,
      type: BUILTIN_TYPES,
    },
    contains: [STRING, NUMBER, BLOCK_COMMENT, LINE_COMMENT],
  };
});
