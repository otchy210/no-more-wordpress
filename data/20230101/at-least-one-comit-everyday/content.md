# 2022 年の 365 日間、毎日コミットを達成したのでその間に作ったものを紹介します

元々、淡々と何かを繰り返し継続するのが得意な性分で、2021 年 12 月中旬頃、不意に「あ、毎日コミットやったこと無かったわ、やってみよ」と思い立ったので、それからずっと毎日[何かしら GitHub 上でコミット](https://github.com/otchy210?tab=overview&from=2022-12-01&to=2022-12-31)してました。

それから一年とちょっと経ち、2022 年の 365 日間は毎日コミットを達成したので、これを機会にその間に作った物を紹介したいと思います。

## [SimDoc DB](https://github.com/otchy210/sim-doc-db#%E6%97%A5%E6%9C%AC%E8%AA%9E)

後述の HomeTube で使うために作った、おれおれデータベースです。README からちょっと引用します。

> SimDoc DB は TypeScript で書かれたシンプルなインメモリドキュメントデータベース (NoSQL) です。ぶっちゃけ車輪の再発明ではありますが、このライブラリには他ではあまり見ない以下のような利点があります。
>
> - デフォルトであらゆる多バイト文字の全文検索をサポートしています。
>   - 日本語や絵文字 (😄) も問題なし。
> - 外部ライブラリに一切依存せず単体で動作します。
> - Node.js 上、ウェブブラウザ上のいずれでも動作します。
> - 超軽量で超高速。
>   - JS ファイルの合計で 19KB です。(バージョン 0.12.0 現在)
> 
> なので、もしウェブブラウザ上で動作する SPA で使うシンプルなインメモリ DB を探しているのなら、このライブラリが完璧にマッチするかもしれません。

自分で言うのもなんですがだいぶ良く出来ていて、特定用途に限っては非常に便利なので、今後も自分でメンテしつつ使ってくと思います。実際、当初の目的だった HomeTube 以外の用途でも使いました。

## [HomeTube](https://github.com/otchy210/home-tube/blob/main/README.ja.md)

元々これを作りたいと思ったのが、毎日コミットのきっかけになったと言っても過言ではありません。前述の [SimDoc DB](https://github.com/otchy210/sim-doc-db) を書いた他、[API サーバ](https://github.com/otchy210/home-tube-api)と [Web サーバ](https://github.com/otchy210/home-tube) を分けて書いたりしていて、なかなか真面目な作りです。再び README から引用します。

> HomeTube はローカルストレージやローカルネットワーク上にある動画に対して、YouTube っぽい機能を提供するウェブアプリです。「ウェブアプリ」といっても、ローカルのファイルを読み込む必要があるので、あらかじめ用意されたサーバがあるわけではありません。自分自身でローカルにサーバを立てて利用して下さい。

要は、クラウドに上げたくない動画、あるいはクラウドに上げたら量が多すぎて課金が酷いことになる動画を、ローカルに置いたまま YouTube のようにサムネイルで検索したり、プレビューを見たり、タグ付けしたり出来るウェブアプリです。

中でも一番やりたかったのがシークバー上でのプレビュー。

<blockquote class="twitter-tweet" data-conversation="none"><p lang="ja" dir="ltr">サムネイルのバグもなおって、ムービープレーヤーが完成したー！<br>一通りの基本機能がちゃんと動いてるし、なんと言ってもサムネイルが良い。アニメーション抑えめでキビキビ動いたり、カーソルの動きを止めた時にコントロールを隠すまでの時間が短めなのは自分の好み。 <a href="https://t.co/2mKPmgZTQv">pic.twitter.com/2mKPmgZTQv</a></p>&mdash; Otchy (@otchy) <a href="https://twitter.com/otchy/status/1487586901649653760?ref_src=twsrc%5Etfw">January 30, 2022</a></blockquote>

一通りの機能の簡単な紹介ムービーはこちら。ちょっと UI が古いバージョンですが。

<blockquote class="twitter-tweet" data-conversation="none"><p lang="ja" dir="ltr">バージョン 0.0.x を 0.0.120 まで積み上げた後、ソートを実装してようやく v0.1.0 に到達！ここまでは絶対実装したい、と思っていた機能が一通り揃った！！<br><br>自画自賛するけど、ローカルに保存したムービーでここまでの事ができるのすごない？ <a href="https://t.co/3KU7UlvvdT">pic.twitter.com/3KU7UlvvdT</a></p>&mdash; Otchy (@otchy) <a href="https://twitter.com/otchy/status/1493389914133925890?ref_src=twsrc%5Etfw">February 15, 2022</a></blockquote>

## [When It Will Be](https://github.com/otchy210/when-it-will-be)

これはちょっと変わり種で、会社のハッカソンプロジェクトで作った Google Chrome エクステンションです。なんら社内の情報に関係のあるものじゃ無かったので、GitHub のコミットが稼げるな、っていう邪な気持ちで個人のリポジトリに置きました。

社内で流れてるメールや Slack メッセージに日時が書かれるとき、大抵はタイムゾーンがセットで書かれているんですが、日本時間に脳内ですぐに変換できないし、何ならタイムゾーンの表記も "CT" だの "Central Time" だの "Central" だの統一感が無かったりするので、それらの問題を解決するために書きました。

タイムゾーン "っぽい" 文字列の上にマウスカーソルを当てると、その前にある時刻 "っぽい" 文字列を拾って、あらかじめ設定したタイムゾーンに変換した時間をポップアップしてくれる感じです。

![When It Will Be](/s/img/at-least-one-comit-everyday/when-it-will-be.gif)

技術的な面でいうと、HTML/JS 的にカーソルの下にある「HTML 要素」を取得するのは簡単なんですが、カーソルの下にある「単語」の「範囲」を取得するのはちょっと一癖ある実装が必要で、そのあたりが見所になっています。

## [ScalableDots](https://scalable-dots.otchy.net/)

2022 年で一番頑張ったやつです！ちゃんとドメインまで設定して真っ当なサイトとして公開しました。百聞は一見にしかずなので、上のリンクを開いて遊んでみて欲しいです。とりあえずサイト上の説明から引用します。

> ScalableDots は PNG や GIF などの画像ファイルを SVG 画像に変換するツールです。元の画像にある各ピクセルを一つずつ、SVG 上の要素に置き換えて元の色で塗りつぶすことで変換を行っています。主な用途としては、ドット絵 (Pixel art) を SVG に変換するために使います。
> 
> ドット絵を Web で公開する場合、等倍で表示すると小さすぎてドット絵としての魅力が十分に伝わらないので、一般には拡大して表示するようにしますが、SVG 画像として公開する事で任意の倍率で綺麗に拡大することが出来るようになります。

コード自体は、コアになる実際の変換ロジックを実装した [scalable-dots-core](https://github.com/otchy210/scalable-dots-core)、変換ロジックをコマンドラインツールとして利用できるようにした [scalable-dots-cli](https://github.com/otchy210/scalable-dots-cli)、そして画像の変換を Web 上でお手軽に試せるようにした [scalable-dots-web](https://github.com/otchy210/scalable-dots-web) に分かれていて、その Web 版を GitHub Pages でホストしたのが [ScalableDots](https://scalable-dots.otchy.net/) です。

Twitter でもプチバズりをいただきました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">ScalableDots という新しいツールを公開しました！<br>PNG や GIF (ラスター画像) で作られたのドット絵を SVG (ベクター画像) に変換することで、任意の倍率に拡大縮小しても、ドットのエッジが綺麗なまま表示出来るようにするツールです。<a href="https://twitter.com/hashtag/%E3%83%89%E3%83%83%E3%83%88%E7%B5%B5?src=hash&amp;ref_src=twsrc%5Etfw">#ドット絵</a> <a href="https://twitter.com/hashtag/pixelart?src=hash&amp;ref_src=twsrc%5Etfw">#pixelart</a><a href="https://t.co/OEJWsOUuSv">https://t.co/OEJWsOUuSv</a></p>&mdash; Otchy (@otchy) <a href="https://twitter.com/otchy/status/1537946053722669056?ref_src=twsrc%5Etfw">June 17, 2022</a></blockquote>

## [GitHub Notes](https://github-notes.otchy.net/)

これもドメインを設定して公開中のウェブアプリです。前々から温めていたアイディアを形にした、多分に実験的な要素を含むアプリになります。とりあえず例によって README から引用します。

> GitHub Notes は GitHub レポジトリにメモを保存する、オープンソースバージョンの Apple メモあるいは Google Keep です。したがって、実際の所 Microsoft に依存してはいますが、はるかにオープンに管理されています。また、全てのメモは Markdown で保存されます。

説明を読んでピンと来る方もいるかと思いますが「オンラインで同期するメモアプリを使いたい、でも万一のサ終を考えると踏み切れない」人にとって究極の解になりうるアプリです。そもそも GitHub のサ終リスクがだいぶ低い上に、そのリスクすら、ローカルにクローンを持てばデータの損失は確実に避けられるからです。

「実験的な要素を含む」と前置きしましたが、技術的な面で面白い点は、データの読み書きを行うメモアプリでありながらも、このアプリ自体は一切のバックエンドを持っていないという点です。フロントエンドから直接 GitHub の API を叩くことで、GitHub のレポジトリをバックエンドとして利用しデータを直接コミットするというアクロバティックな事をやっています。

また、モバイルファーストでデザインしたものをどのようにレスポンシブにするか、についても実験的な UI を実装してみました。まずモバイルビューでは普通のアプリっぽく最初に一覧があり、概念的には画面の右側にメモのエディタ、さらに右にプレビューという作りにします。この状態からウィンドウの横幅を広げると 2 ペインになってエディタとプレビューが同時に見れたり、さらに広げると 3 ペインになって一覧、エディタ、プレビューが同時に見える、といった感じです。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">「ネイティブアプリ風にデザインしたモバイルサイトをどうレスポンシブにするか」という課題に対して以前から温めていたアイディアを実装した。<br>なかなか良い出来になってホクホクしている。 <a href="https://t.co/xhskYt7axQ">pic.twitter.com/xhskYt7axQ</a></p>&mdash; Otchy (@otchy) <a href="https://twitter.com/otchy/status/1582386148844138498?ref_src=twsrc%5Etfw">October 18, 2022</a></blockquote>

なお、メモアプリなので当然検索機能も実装しているのですが、そこで再び [SimDoc DB](https://github.com/otchy210/sim-doc-db) が活躍しています。ソースコードは[こちら](https://github.com/otchy210/github-notes)です。

## [It LGTM but TBH IDK so WDYT](https://chrome.google.com/webstore/detail/it-lgtm-but-tbh-idk-so-wd/djgmnhkpcfhhmnkajphahjanfebedfeo)

再び Google Chrome エクステンションです。"It LGTM but TBH IDK so WDYT" は "It looks good to me but to be honest I don't know so what do you think" と発音します。我々にとってなじみ深い LGTM を始めとして、普段英語で仕事をしているとこの手の略語が山ほど出てくるので、それらの意味を簡単に参照できるようにするためのツールです。[When It Will Be](https://github.com/otchy210/when-it-will-be) で作ったカーソルの上で情報をポップアップさせる実装を流用して作っています。

実装自体にはこれと言って特筆するところもないのですが、学習用ツールという位置付けなので、すでに身についていてもはや意味を確認する必要の無い略語は、一つ一つ無効にする機能をつけたっていうのがポイントかなと思います。

仕事中に「あ、これ追加されてない」っていうのに気付くたびにメモしていて、2〜3 個たまるとは[単語のリスト](https://github.com/otchy210/it-lgtm-but-tbh-idk-so-wdyt/blob/main/src/words.txt)を更新してるので、コミット数を稼ぎやすいっていう意味ではズルいレポジトリですね。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">新しい Google Chrome エクステンション書きました！(無事に審査が通りました)<br>要は「LGTM って言われてもなんの略か分からんわ」を解決するやつです。(続 <a href="https://t.co/0XI9allRrv">pic.twitter.com/0XI9allRrv</a></p>&mdash; Otchy (@otchy) <a href="https://twitter.com/otchy/status/1598235278220890117?ref_src=twsrc%5Etfw">December 1, 2022</a></blockquote>

ソースコードは[こちら](https://github.com/otchy210/it-lgtm-but-tbh-idk-so-wdyt)。

## Electron App Tutorial

自分でチュートリアルをやったり色々実験したりしたプライベートリポジトリで公開すらしてないんですが、毎日コミットの一部ではあるので一応ご紹介します。

[HomeTube](https://github.com/otchy210/home-tube/blob/main/README.ja.md) ではローカルに保存された動画のビューワを作りましたが、それの漫画版が欲しいなと思っています。作るのは基本的には zip で固められた画像ファイルのビューワで、それに加え、特定フォルダ以下の全ての対象ファイルをサムネイルで一覧したり、何なら OCR にかけてセリフを検索可能にしたいなと。

HomeTube は、自分で `Node.js` や `ffmpeg` をインストールしてコマンドラインからデーモンを起動できる人じゃないと使えないのですが、漫画のビューワを作るなら、いっそもうネイティブアプリとして起動できたら良いんじゃないかと。それならばとりあえず Electron だな、どれどれ…と始まったのがこのチュートリアル＋いくらかの実験です。

<blockquote class="twitter-tweet" data-conversation="none"><p lang="ja" dir="ltr">「Electron 使ってやりたいのは要はこれなのだ」が、出来た。裏で走らせたデーモンの制御をシステムトレイから GUI でやりたかったのだ。<br>あとはデーモン書くだけだが、まあそこがメインなのでこれから先が長い。(そして楽しい) <a href="https://t.co/wZgvzVdLHg">pic.twitter.com/wZgvzVdLHg</a></p>&mdash; Otchy (@otchy) <a href="https://twitter.com/otchy/status/1601884372512428032?ref_src=twsrc%5Etfw">December 11, 2022</a></blockquote>

一通りの検証が済んでやりたい事が全部できる見込みが立ったので、[Mangamil](https://github.com/otchy210/mangamil) という名前をつけて実際に作り始めました。2023 年の最初のアプリがこれになりそうです。この新しいアプリのリポジトリ上にもコミットが追加されていっていますが、まだまだちゃんと動作する物はないので、この記事では特段の紹介はしません。

## [Feedly はてブ](https://chrome.google.com/webstore/detail/feedly-%E3%81%AF%E3%81%A6%E3%83%96/ggaaakgimbjhmglfoahnaoknmceipgni)

Google Chrome エクステンション再び、ですが、これは 2022 年中に新しく作ったわけでは無く、元々あったものをメンテで更新したという感じです。

Feedly の UI 上に、はてなブックマークの数を表示するというエクステンションで、まず自分自身がヘビーユーザーですが、他にも地味にコアなファンの方に使っていただいています。2022 年は、Feedly 側の仕様変更に追随するため、二度ほど更新しました。

![Feedly はてブ 1](/s/img/at-least-one-comit-everyday/feedly-hatebu-1.png)

![Feedly はてブ 2](/s/img/at-least-one-comit-everyday/feedly-hatebu-2.png)


2023 年には Google Chrome エクステンションの Manifest v3 への強制移行が控えており、[現在の方法による API 呼び出し](https://qiita.com/otchy/items/c8506f21788e97097097)では、v3 で強化されたセキュリティために動作しなくなることが分かっているので、それに対応するバージョンの準備も始めています。

ソースコードは[こちら](https://github.com/otchy210/feedly-hatebu)。

## いかにして毎日コミットを達成したか

さて、ここまでずっと作ったものの話をしてきましたが、作りたいものがあっただけで毎日コミットが達成できるというものでも無いので、ちょっとしたズルも含め、いかにしてそれを達成したかについても触れておきたいと思います。

### ハードルを下げる

毎日コミットを目標にしたので、あまりちゃんとしたコミットで無くても良いという風にハードルを下げることにしました。無意味に空行を追加する、みたいのはさすがにひどいのでやらなかったですが、「`README.md` に説明を追加する」くらいは許容範囲という感じです。バグフィックスをする時に、小さなバグであっても一つ一つ別コミットで修正したりもしました。

そこまでしてやる必要ある？っていう考えもあると思いますが、いったんどこかで途切れると気持ちも切れてしまう気がしたので、毎日コミットが途切れないことを優先させていました。

ただ唯一これだけはひどかったなと思うし、一方で良く途切れさせてなかったなと思うのは、久々の飲み会に気を良くして、その日はまだ何もコミットしてなかったのに大層酔っ払ってしまった時の事です。帰りの電車の中ですごく眠くて記憶も飛び飛びになりながら、一瞬我に返ったタイミングで気合いと根性で GitHub のウェブ上の UI から `README.md` に数行だけ記述を追加したコミットがありました。この一つだけは本当にひどかった。この日以降、飲み会が予定されている日は飲み会前に確実にコミットするようになりました。

### アイディアノート

ちょっとした小さな機能追加や、簡単に直せそうなバグはメモしてストックしていました。短ければ 5 分、長くても 15 分もあれば終わるような修正をストックしておき、それをあまり時間の無いときとかに消費するようにしていました。

継続モチベージョン維持のための準備としてやっていたわけですが、ちっちゃなバグを見つけると「すぐに直すのはもったいない、とりあえず取っておこう！」ってなるのは、なかなか新鮮な(？)感覚でした。

またそれと類似した話になりますが、夜間にテンポ良く開発していてちょうど切り良くコミットしたくなったタイミングが 23:50 くらいだったりすると「この時間にコミットするのはもったいないな…あと 10 分寝かして明日分にしちゃおう。」みたいな調整は、まあ…してました。

### GitHub as a backend

"GitHub as a backend" とか言われても何のことだか分からないですよね。例えばいまあなたが見ているこのブログ、自作の静的サイトジェネレータ (参考: [自作のブログシステムに OTCHY.NET を移行しました](/20210315/my-own-blog-system/) / [いかに爆速ブログシステムを自作し WordPress を置き換えたか](/20221222/how-to-build-original-super-fast-blog-to-replace-wordpress/)) で生成した HTML を GitHub Pages でホストしています。つまり、何かブログに書く＝コミットです。何ならその自作の静的サイトジェネレータの仕様上、下書きを一時保存するのもコミットです。

この GitHub Pages を非常に便利に使っていまして、この記事で挙げるまでもない極々小規模な自分用ツールをホストしたり、ほとんど塩漬けで数年に一度のペースでしか更新していない個人サイトをホストしたりしてるので、それらも更新があるたびに全部コミットです。

その最たる物が上で説明した [GitHub Notes](https://github-notes.otchy.net/) で、これを使ってメモを作成すると、いくらでも簡単にコミットを増やせます。…まあこれはさすがにチートが過ぎるので、開発中にテストで作られたコミット以降はカウントされないようにしていますが、"GitHub as a backend" の意味はお分かりいただけたでしょうか。

### コミットのペース

年間通じてのコミットのペースを考えたときに、後半になるにつれペースが遅くなりコミットの数が減っていたことは事実です。中だるみというか、ちょっと義務感が出てしまって疲れていたタイミングもありました。それゆえに、もし到達してたらよりいっそう達成感があったであろう、年間 1,000 contributions には残念ながら届きませんでした。

とは言え、最初にハードルを下げてから始めたおかげで、小さなコミットが続いているときでも淡々と 1 日 1 コミットはし続けて来れましたし、なかなか良い習慣でした。この目標がなかったら、最初に紹介したプログラムらの進捗はもっと遅かったと思います。

## 終わりに

今後もずっと何かしら書き続けるとは思いますが、一年という区切りを迎えてだいぶやりきった感があるので、しばらくは毎日コミットに固執せず、好きなタイミングで好きなだけコミットしようかなと思ってます。2022 年は毎日コミットを意識するあまり、コミットのタイミングを平準化している感じだったので、もっと濃淡が出るイメージでしょうか。

あと、そろそろ積みゲーの消化ペースを上げたいので！FF12 を始めたいんじゃ！

<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>