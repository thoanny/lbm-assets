var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');

const imgSprite = () => {
  var spriteData = gulp.src('src/sprites/*.png', { encoding: false }).pipe(
    spritesmith({
      imgName: 'sprite.png',
      cssName: '_sprite.scss',
    }),
  );
  return spriteData.img.pipe(gulp.dest('public/', { encoding: false }));
};

const cssSprite = () => {
  var spriteData = gulp.src('src/sprites/*.png', { encoding: false }).pipe(
    spritesmith({
      imgName: 'sprite.png',
      cssName: '_sprite.scss',
      cssTemplate: 'src/scss.handlebars',
    }),
  );
  return spriteData.css.pipe(gulp.dest('src/assets/', { encoding: false }));
};

const jsonSprite = () => {
  var spriteData = gulp.src('src/sprites/*.png', { encoding: false }).pipe(
    spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.json',
      cssFormat: 'json_array',
    }),
  );
  return spriteData.css.pipe(gulp.dest('src/data/', { encoding: false }));
};

gulp.task('sprite', gulp.series(imgSprite, cssSprite, jsonSprite));
