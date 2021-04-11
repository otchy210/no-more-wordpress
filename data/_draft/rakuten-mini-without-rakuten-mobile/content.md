# 【人柱】Rakuten Mini を楽天モバイルではない回線 (Y!mobile) で使う

## ありがとう楽天モバイル

何年も待ち続けた iPhone SE 第二世代はディスプレイがでかくなり、その後も mini とは名ばかりのでかいディスプレイの iPhone しか作らなくなった Apple に愛想が尽きて、初代 iPhone SE から Rakuten Mini に乗り換えたのが約 1 年前。Rakuten Mini は、確かに指紋認証と Qi に対応して欲しかったとは思うものの、ハードウェアとしては完璧に近く、この素晴らしい端末を発売してくれた楽天モバイルには感謝しかありません。

ただ 2020 年 4 月時点で楽天モバイルにメイン回線を MNP するのは不安が大きく、さしあたって 1 年の無料期間は楽天モバイル回線の評価期間と位置づけて、メイン回線は Y!mobile のままサブ端末に残しつつ、メイン端末は Rakuten Mini に乗り換えるも回線は楽天モバイルをサブ回線として使うという、ねじれ状態で運用してきました。

そして 2021 年 4 月。楽天モバイル回線の無料期間が終わろうというこの時、そのねじれ状態を解消する日がやってきました。一年間楽天モバイル回線を Rakuten Mini と組み合わせて使い評価した結果、残念ながらやはり繋がりやすさの面で十分な満足を得ることが出来ず、また日本ではほとんど選択肢のなかった eSIM も ahamo 発表以降すっかり流れが変わり選択肢が大幅に増えたため、サブ端末で使っていた Y!mobile のメイン回線を eSIM に切り替えてメイン端末の Rakuten Mini で使う事にしました。

繰り返しになりますが、楽天モバイルには本当に感謝をしています。なので、楽天モバイル回線は物理 SIM に切り替えて維持し、サブ端末に残します。また Rakuten Mini 2 がいつか発売され Apple のようにディスプレイをでかくするという暴挙に出なければ、真っ先に購入しその時に再び楽天モバイル回線を評価したいとも思います。なので「ありがとう楽天モバイル。しばらくの間は疎遠になるけどまたいつかよろしくね。」という気持ちです。

さてそんなわけで前段は終わり。この記事のメインは Y!mobile 回線を eSIM に切り替えて Rakuten Mini で設定して使えるようになるまでの記録です。

## Y!mobile 回線を eSIM に切り替える

オンラインのみで物理 SIM を eSIM に切り替えられると良かったのですが、軽く調べた感じ店頭での手続きでしか方法が無さそうで、またどのみち eSIM に切り替えるに当たって契約内容などに変更が生じないかどうかの確認もしたかったので、Y!mobile ショップに赴いて eSIM に変更してきました。

大手三社はいまどこもそうなのでしょうが、店頭での手続きを行う場合、来店予約は必須と思った方が良いです。予約時間の 10 分前に店舗に着いて待っている間に予約無しで訪れたお客さんがいましたが、事実上の門前払いを食っていました。店内には自分以外に待っている人はおらず、一見すると空いているように見えますが、曰く今から待つと 2 時間は待つとの説明で、そのお客さんはその場で来店予約をしていました。

さて時間になって eSIM への切り替え契約を進めていくと、ご多分に漏れず光回線や電力、PayPay の営業などが入ってきます。ただ自分の場合、すでにほぼほぼ SoftBank 経済圏で暮らしているため特に理屈を並べて断ったりする必要もないので、淡々とスムーズに作業が終わり、20 分程度で eSIM プロファイルダウンロード用のコードが発行され、QR コードがプリントされた紙を受け取れました。

最終的にこういった QR コードが手に入りさえすれば、後の設定はどの会社でも同様のはずですが、どのくらいスムーズにこの QR コードが手に入るのかは各社によってまちまちな気がします。

![step1](/s/img/rakuten-mini-without-rakuten-mobile/step1.jpg)

## Rakuten Mini に新しい eSIM を追加する

Rakuten Mini の eSIM 設定についてネットで検索すると、"my 楽天モバイル" アプリを使った設定方法が出てきますが、これは楽天モバイル回線を設定するための方法なので他社回線では使えません。楽天モバイル回線であれば色々と自動化されていて、eSIM の発行から設定まで楽に済むようになっていますが、他社回線を使う場合は Android 標準の方法で手動で設定する必要があります。

以下、スクリーンショット多めで解説していきます。

まずは設定アプリを開いて、"ネットワークとインターネット" → "詳細設定" → "携帯通信会社" を開きます。

<p class="img-m"><img src="/s/img/rakuten-mini-without-rakuten-mobile/step2.png" alt="step2"></p>

<p class="img-m"><img src="/s/img/rakuten-mini-without-rakuten-mobile/step3.png" alt="step3"></p>

<p class="img-m"><img src="/s/img/rakuten-mini-without-rakuten-mobile/step4.png" alt="step4"></p>

<p class="img-m"><img src="/s/img/rakuten-mini-without-rakuten-mobile/step5.png" alt="step5"></p>

ここで "携帯通信会社を追加" を選択すると eSIM の追加が選べるので画面の指示に従ってそのまま進めていきます。

<p class="img-m"><img src="/s/img/rakuten-mini-without-rakuten-mobile/step6.png" alt="step6"></p>

<p class="img-m"><img src="/s/img/rakuten-mini-without-rakuten-mobile/step7.png" alt="step7"></p>

<p class="img-m"><img src="/s/img/rakuten-mini-without-rakuten-mobile/step8.png" alt="step8"></p>

ここで発行済みの QR コードを読み込んで eSIM プロファイルをダウンロードするわけですが、回線が不安定で何か起きると面倒なので、この先は安定した WiFi 回線に繋いだ状態で行う方が良いでしょう。

<p class="img-m"><img src="/s/img/rakuten-mini-without-rakuten-mobile/step9.png" alt="step9"></p>

QR コードを読み取ると、どの通信会社の eSIM を読み込もうとしているのかが表示されるので、確認の上で進めると eSIM プロファイルのダウンロードが始まります。

<p class="img-m"><img src="/s/img/rakuten-mini-without-rakuten-mobile/step10.png" alt="step10"></p>

<p class="img-m"><img src="/s/img/rakuten-mini-without-rakuten-mobile/step11.png" alt="step11"></p>

数分で、通信会社側での開通処理ならびに eSIM プロファイルのダウンロードが完了しました。

<p class="img-m"><img src="/s/img/rakuten-mini-without-rakuten-mobile/step12.png" alt="step12"></p>

携帯電話通信会社の一覧に Y!mobile が追加され、電波も Y!mobile のものを掴んでいることが分かります。ただし、この時点では eSIM の設定が完全には完了しておらず、元々設定済みの楽天モバイル回線と比較すると分かると思いますが、電話番号が表示されていません。

<p class="img-m"><img src="/s/img/rakuten-mini-without-rakuten-mobile/step13.png" alt="step13"></p>

丁寧なことに、程なくして Y!mobile から端末の再起動を促す SMS が届きました。ここも恐らく各社によって対応が分かれるところです。そもそも SMS が使えない回線の場合は通知のしようもありませんし。いずれにせよ、eSIM を切り替えたら端末を再起動する必要がある、という事は覚えておくと良さそうです。

<p class="img-m"><img src="/s/img/rakuten-mini-without-rakuten-mobile/step14.png" alt="step14"></p>

指示に従って端末を再起動すると、無事に Y!mobile の電話番号が表示されるようになりました。

<p class="img-m"><img src="/s/img/rakuten-mini-without-rakuten-mobile/step15.png" alt="step15"></p>

念のためデータ通信、電話回線通話など試してみましたが、特に何の問題もなく普通に使う事が出来ました。以上で Rakuten Mini で他社の eSIM を使う方法の解説は終了です。

## Rakuten Mini のバンド １ 問題

さて、以上で記事を終えても良かったのですが、Rakuten Mini を楽天モバイルではない回線で使う方法を解説した以上、この話題に触れないわけにはいかないでしょう。いわゆる「バンド1」問題です。この問題の詳細に関しては「[Rakuten Mini で特定の周波数が使えない──「Band 1 問題」を斬る（石野純也）](https://japanese.engadget.com/rakuten-mini-091550161.html)」に詳しいですが、平たく言うと、初期ロット以外の Rakuten Mini を日本国内で使う場合、他社の回線はあまり使い物にならない、という事です。自分の場合は幸いにして早い段階で Rakuten Mini を入手していたので特に問題になりませんでしたが、2020 年 5 月以降に入手した場合は、よくよく確認してから手続きを進めることをお勧めします。

また Y!mobile (＝SoftBank 回線) を前提とすると、初期ロットであっても、全国を広くカバーするバンド 1 とバンド 3 には両方対応しているものの、SoftBank が唯一持つプラチナバンドである バンド 8 (900MHz 帯) には対応しないので、その点にも留意が必要です。それを踏まえてなお、楽天モバイル回線よりはずっと良さそう、という現時点での判断な訳ですが。

## ところで LINEMO は検討しなかったの？

もちろん検討しました。ただ、前述のように普段の生活から SoftBank 経済圏で暮らしているため、Y!mobile 回線にすることで得られる、SoftBank 光の割引、PayPay の特典、Yahoo! ショッピングでのポイント還元など考えると、LINEMO よりも Y!mobile の方が断然得であるという結論になりました。月々のギガ消費が 20 GB に迫る水準であればあるいは LINEMO の方が得なのですが、在宅勤務真っ盛りで 1 GB 使う月がレアという状況では Y!mobile のプラン S が自分にとってのベストです。

## 以上

快適な Rakuten Mini ライフを送る一助になればと思います。