#!/bin/sh

echo "\n************* 打包 *************"
rm -rf .next
npm run build
echo "\n************* 上传 *************"
rsync -av --delete out/ root@192.168.19.26:/opt/nginx/front/mdconv/
echo "\n************* 完毕！ *************"
