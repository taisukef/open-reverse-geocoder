# @geolonia/open-reverse-geocoder

オープンソースかつ無料で利用できる逆ジオコーダーです。

このESモジュールを使用すると、緯度経度から都道府県名および市区町村名を検索することができます。

都道府県名および市区町村名を検索するために必要なデータを、ベクトルタイルフォーマットで GitHub ページ上にホストしていますので、安心して無料でご利用いただけます。

[デモ](https://codepen.io/geolonia/pen/oNZLPQP)

また、GitHub ページ上にホストしたベクトルタイルを使用して都道府県名と市区町村を取得するという仕様のため、このモジュールを開発する Geolonia では個人情報の収集を一切行っておらず、安心してご利用ただけます。

## 仕組み

1. `openReverseGeocoder()` の引数として指定された緯度経度を元に、クライアントサイドでズームレベル10相当（約30km平米）のタイル番号を取得し、ウェブサーバーからベクトルタイルを fetch でダウンロードします。
2. fetch でダウンロードしたベクトルタイルの中に含まれる市区町村のポリゴンの中から、指定された緯度経度が含まれるポリゴンをクライアントサイドで検索し、都道府県名及び市区町村名を返します。

## API

```
import { openReverseGeocoder as geocoder } from 'https://taisukef.github.io/open-reverse-geocoder/src/main.js';
const res = await geocoder([139.7673068, 35.6809591]);
console.log(res);
```

## 開発者向け情報

### タイルのビルド方法

まず、このリポジトリをクローンする。

```
$ git clone git@github.com:geolonia/open-reverse-geocoder.git
$ cd open-reverse-geocoder
```

その後、以下のコマンドを実行すること。

```
$ npm run build:tiles
```

#### 上述のコマンドの解説

1. まず国土数値情報から、最新の行政区域データをダウンロードする。最新版は URL が変わるので注意。
2. 解凍
3. `ogr2ogr` で GeoJSON に変換。ファイル名に注意。 (macOS の場合は `brew install gdal` でインストールできます)
4. タイルのプロパティを調整するためのスクリプトを実行。
5. `tippecanoe` で `*.mbtiles` を作成。意図的に圧縮を無効にしている。
6. タイルを分解して静的に利用できるようにする。

## 出典

都道府県及び市区町村データについては、国土数値情報の行政区域ポリゴンを使用しています。

https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v2_4.html

## ライセンス

MIT
