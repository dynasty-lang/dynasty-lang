# This "hook" is executed right before the site's pages are rendered
Jekyll::Hooks.register :site, :pre_render do |site|
  require "rouge"

  class Dynasty < RegexLexer
    title "Dynasty"
    desc "Dynasty, the modern alternative for C/C++"

    tag 'dynasty'
    aliases 'dn'
    filenames '*.dn'
    mimetypes 'application/x-dynasty', 'text/x-dynasty'

    def self.detect?(text)
      return 0
    end

    state :multiline_comment do
      rule %r(-#), Comment::Multiline, :pop!
      rule %r$(?:[^-#]|(?<!-)#|-(?!#))+$, Comment::Multiline
    end

    state :comments_and_whitespace do
      rule %r/\s+/, Text
      rule %r(#-), Comment::Multiline, :multiline_comment
      rule %r(#.*?$), Comment::Single
    end

    state :expr_start do
      mixin :comments_and_whitespace

      rule %r/[{]/ do
        token Punctuation
        goto :object
      end

      rule %r//, Text, :pop!
    end

    def self.keywords
      @keywords ||= Set.new %w(
        if for while in return continue break else as
      )
    end

    def self.declarations
      @declarations ||= Set.new %w(
        fn var inv type fn import from
      )
    end

    def self.reserved
      @reserved ||= Set.new %w(
        extern
      )
    end

    def self.constants
      @constants ||= Set.new %w(this)
    end

    def self.builtins
      @builtins ||= %w(
        range print str stoi stof
      )
    end

    def self.id_regex
      /(?:[a-z_][a-z_0-9]*\.)*[a-z_][a-z_0-9]*/io
    end

    id = self.id_regex

    state :root do
      rule Comment::Preproc, :statement
      rule %r((?<=\n)(?=\s)), Text, :expr_start
      mixin :comments_and_whitespace
      rule %r(not)x,
        Operator, :expr_start
      rule %r/[(\[,]/, Punctuation, :expr_start
      rule %r/;/, Punctuation, :statement
      rule %r/[)\].]/, Punctuation

      rule %r$and|or|xor|not|mod$, Operator::Word
      rule %r$\\*|==|->|\\*\\*|/|\\+|-|&|\\||\\^|>>|<<|>|>=|!=|<=|<|=$, Operator

      rule %r/[{}]/, Punctuation, :statement

      rule id do |m|
        if self.class.keywords.include? m[0]
          token Keyword
          push :expr_start
        elsif self.class.declarations.include? m[0]
          token Keyword::Declaration
          push :expr_start
        elsif self.class.reserved.include? m[0]
          token Keyword::Reserved
        elsif self.class.constants.include? m[0]
          token Keyword::Constant
        elsif self.class.builtins.include? m[0]
          token Name::Builtin
        else
          token Name::Other
        end
      end

      rule %r/[0-9][0-9]*\.[0-9]+([eE][0-9]+)?[fd]?/, Num::Float
      rule %r/0x[0-9a-fA-F]+/i, Num::Hex
      rule %r/0[0-7][0-7_]*/i, Num::Oct
      rule %r/0b[01][01_]*/i, Num::Bin
      rule %r/[1-9][0-9]*|0/, Num::Integer

      rule %r/r?"/, Str::Delimiter, :dq
      rule %r/r?"""/, Str::Delimiter, :tq
      rule %r/:/, Punctuation
    end

    state :dq do
      rule %r/\\[\\nrt"]?/, Str::Escape
      rule %r/[^\\"]+/, Str::Double
      rule %r/"/, Str::Delimiter, :pop!
    end

    state :tq do
      rule %r/\\[\\nrt']?/, Str::Escape
      rule %r/(?:[^"]|(?<!"")")+/, Str::Single
      rule %r/"""/, Str::Delimiter, :pop!
    end

    # object literals
    state :object do
      mixin :comments_and_whitespace

      rule %r/[{]/ do
        token Punctuation
        push
      end

      rule %r/[}]/ do
        token Punctuation
        goto :statement
      end

      rule %r/(#{id})(\s*)(:)/ do
        groups Name::Attribute, Text, Punctuation
        push :expr_start
      end

      rule %r/:/, Punctuation
      mixin :root
    end
  end
end