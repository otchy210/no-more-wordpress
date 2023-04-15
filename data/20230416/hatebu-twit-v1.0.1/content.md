# 「はてブついっと」という Google Chrome エクステンションを公開しました

「[はてなブックマークで Twitter 連携機能・Twitter ログインが利用できない障害が発生しています](https://bookmark.hatenastaff.com/entry/2023/04/08/074419)」という障害 (？) の報告をうけて、Twitter API の状況に関わらず、はてブのエントリーページから自分のブコメを簡単にツイート出来る Google Chrome エクステンションを書きました。

本家 twitter.com 上の URL https://twitter.com/intent/tweet を必要なパラメータと共に開くと、ツイートの内容がプリセットされた状態で画面が開く、という本家の機能を利用しており、Twitter API には一切頼っていないため、障害 (？) 耐性が大変高くなっております。

このエクステンションをインストールすると、はてなブックマークのエントリーページに「Twitter を開く」アイコンが追加されるので、それをクリックするといい感じになります。

![はてブついっと](/s/img/hatebu-twit-v1.0.1/animation.gif)

インストールは [chrome ウェブストア](https://chrome.google.com/webstore/detail/%E3%81%AF%E3%81%A6%E3%83%96%E3%81%A4%E3%81%84%E3%81%A3%E3%81%A8/ciiacodoiephflaplbkcfflplilpbgmm?hl=ja&authuser=0) から行ってください。ソースコードは [GitHub](https://github.com/otchy210/twitter-hatebu) で公開しています。皆様のお役に立てれば幸いです。

## ずいぶん昔の思い出

10 年以上前に作って使っていた「[はてブ with Twitter](/greasemonkey/hatebu-with-twitter/)」は、公式で Twitter がサポートされて開発終了していましたが、まさか令和の時代になってこんな形で復活するとは思いませんでした。

## もしかして Feedly も使っていませんか？

Feedly ユーザ様におかれましては、姉妹品の「[Feedly はてブ](https://chrome.google.com/webstore/detail/feedly-%E3%81%AF%E3%81%A6%E3%83%96/ggaaakgimbjhmglfoahnaoknmceipgni)」もよろしくお願いします。