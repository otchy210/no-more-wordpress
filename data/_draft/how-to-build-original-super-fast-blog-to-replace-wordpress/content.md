# いかに爆速ブログシステムを自作し WordPress を置き換えたか

一つ前のポスト「[自作のブログシステムに OTCHY.NET を移行しました](/20210315/my-own-blog-system/)」で書いたように、[OTCHY.NET 公開](/20081223/otchy-net-published/)時から 12 年以上の間、幾度かのバージョンアップやサーバの乗り換えを経てもずっと使っていた WordPress を、ついに完全自作のブログシステムで置き換えました。

ブログシステムを自作するにあたってはとことん速度にこだわって作ったので、ここではいかにして爆速ブログシステムを作ったかという話をします。なぜ今さらになってブログシステムを自作したかという話は一つ前のポストを読んで下さい。

## 静的サイトジェネレータ

そもそもシステムの自作を始めた理由が、WordPress で提供している全てのページを静的な HTML に置き換えたい、というものでした。したがって、作るシステムが静的サイトジェネレータになるのは大前提でした。爆速システムを作りたかったから静的サイトジェネレータを選択したというよりは、静的サイトジェネレータを作ることにした→ページの表示速度も速くなるはずだ→どうせなら爆速を目指そう、という事です。

ただ静的サイトジェネレータに関して一般的に言われることとして、動的な HTML 出力よりもレンダリングは速くなる一方で、特にページ数が多くなると、事前に HTML を出力する処理自体にかかる時間は長くなるというものがあります。これは静的サイトジェネレータが悪いというわけではなく、単にどのタイミングで時間を使うかというトレードオフの問題です。

でも言うて 10,000 ページとか記事があるわけでは無くせいぜい数百のオーダーなので、速度にこだわって作れば HTML 出力も遅くなるはずは無い、という肌感覚はありました。そこで自作システムでは HTML 出力もレンダリング速度も高速、という良いとこ取りを目指しました。以下、どういうポイントにこだわって高速化をしたかを解説していきます。

## データベースを持たない

もともとの WordPress のデータは MySQL データベースに格納されているので、そこから直接データを取得して HTML を生成するという選択肢もありました。しかし、以下の理由からデータベースを持つ事に取り立ててメリットは無いと判断しました。

- データベースにアクセスするにはその都度オーバーヘッドがある
- 静的サイトジェネレータではどのみち全ページを毎回再生成するので、データベースが持つ多様で高速な検索機能が不要
- 自分一人しか使わないので ACID 原則を気にする必要が無い

そこでデータベースから取得したデータをいったん全てテキストファイルとして保存するというプロセスをつくりました。それには以下のようなメリットがあります。

- データを git で管理できる
- 後々のデータ更新が早くて楽
- 各ページに関するデータをなるべく一ヶ所にまとめることで、元のテーブル設計上避けられない JOIN 句を多用した SELECT 文よりよりもパフォーマンス的に有利
    - 具体的には `content.html` と `meta.json` の 2 つのファイルだけで各ページの情報を管理

## 汎用的に作らない

WordPress のデータベース上に保存されていたデータをテキストファイルに落とし込む過程で WordPress の設定を読み込んで真面目に実装することで、汎用的な、誰でも使える WordPress の乗り換え先としての静的サイトジェネレータをつくる事もできました。世の中的にそんなニーズもあるだろうし、それで喜んでくれる人もいるだろうとも思いました。Git リポジトリ名の [no-more-wordpress](https://github.com/otchy210/no-more-wordpress) はそんなことを考えていた時の名残でもあります。MySQL のパスワードなどが保存される `config.mjs` が `.gitignore` で隠蔽され、代わりに `config.example.mjs` がコミットされているのも、そう、その名残です。

しかし、汎用的な作りは常にスピードとトレードオフです。そこで WordPress の設定項目をデータベースから読み込む事は一切せず、各ポストや一覧ページの URL、そのコンテンツなどは完全に決め打ちのハードコードで、自分だけが満足するように実装しています。汎用的で無いが故にテストも楽で、開発スピードが上がるという副次的効果もありました。開発スピードが速いというのは、特に個人プロジェクトにおいては、自身のモチベーションを高く保つ上で重要ですね。

## ライブラリの利用を最小限にする

黎明期から JavaScript を書いている身としては、近年の npm を通じて提供されるライブラリの充実っぷりには目を見張るばかりです。自分も自分しか使わないであろう[ツールを公開](https://www.npmjs.com/settings/otchy/packages)したりもしています。ところがいくら便利でも、大半の人気のあるライブラリは汎用的な作りになっていて、前述のようにパフォーマンス上は不利になることが多いです。また利用するライブラリが増えれば、単純にその分だけライブラリ自体の読み込みにも時間がかかります。そこで、ライブラリの利用は最小限に抑えました。

HTML/JS/CSS の minify、Data URI のエンコード、Markdown のパース/HTML 化はさすがにライブラリに頼りましたが、せいぜいそのくらいです。楽ちん便利ユーティリティの類は使っていません。

また、最初は HTML を生成するロジックに**半ば無意識**で何らかのテンプレートライブラリを使おうとしました。しかしテンプレートライブラリというと、大抵は何らかの制御構文 (if/for/whileなど) がセットになっており、それらをパースする時間、実行する時間が重いです。JavaScript エンジンの上で別の言語を動かすようなものなので当たり前ですね。

一方、現代の JavaScript はテンプレートリテラルを持っており、かなり高い自由度でしかも高速に動作します。そのことに気付いたので、HTML の出力にテンプレートライブラリは一切使わずに、愚直にテンプレートリテラルでそのまま書いています。実際の挙動としてはひたすら文字列を連結しているだけなのですが、読みやすい構文のお陰で苦も無く書くことができました。

## 小さく早いライブラリを選び何ならライブラリ自体をカスタマイズする

少ないながらも使うライブラリの選定には、なるべくサイズが小さく早いものを選ぶようにしました。これだけだとまあそれだけの話なのですが、それに加え、必要であればライブラリ自体をカスタマイズして高速化もしました。

これは JavaScript ではなく CSS 側の話になります。CSS に関しても一切ライブラリに頼らず全て自分で書くことも検討したのですが、ちゃんと複数のブレークポイントを持ったレスポンシブなデザインを自作するのは~~ダルすぎた~~労力に対価が見合わないので、CSS フレームワークは利用する事に決め、サイズと速度に定評のある [mini.css](https://minicss.org/) を選びました。

mini.css 自体、元々かなりスリムで余計なところの無いフレームワークで良いのですが、それでもやはり使っていくうちに、微調整で上書きしたくなるところ、まるっと不要な機能などがあることが分かりました。

実際に細かく調整したくなるところや変更頻度が多そうなところについては少量の上書き用 CSS で対応しているのですが、ガッツリと機能を削りたい部分については、mini.css をフォークして不要な部分を削った言わば ミニ mini.css を定義してビルドしています。結果として、CSS をフルスクラッチで自作していていたとしたら大体こんな感じだったろうと思うものに近いものができて満足しています。

## めっちゃメモリに載せる

minified css / js キャッシュする

## セキュリティに強い

を上の方に置く。

## 非同期I/O を多用する

## 抜かりなく最適化する

## 自動で minify・インライン化

## M1 Mac すげーわ