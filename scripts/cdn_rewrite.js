const path = require('path');

hexo.extend.filter.register('after_render:markdown', function(str, data) {
  // 本地预览模式不替换，保留相对路径
  if (hexo.env.cmd === 'server') return str;

  // 只处理 _posts 目录下的文章
  if (!data || !data.path) return str;
  if (!data.path.startsWith('_posts/')) return str;

  // 获取文章所在的文件夹名
  const dirName = path.dirname(data.path).replace('_posts/', '');
  if (!dirName || dirName === '.') return str;

  const cdnBase = `https://cdn.jsdelivr.net/gh/Juster955/Juster955.github.io@main/source/_posts/${dirName}/`;

  // 替换 src="图片名.jpg" 或 href="图片名.jpg" 为 CDN 链接
  return str.replace(
    /(src|href)="([^"\/]+\.(jpg|jpeg|png|gif|webp|svg|bmp))"/gi,
    (match, attr, filename) => {
      return `${attr}="${cdnBase}${filename}"`;
    }
  );
});