import lume from "lume/mod.ts";
import picture from "lume/plugins/picture.ts";
import transformImages from "lume/plugins/transform_images.ts";
import sass from "lume/plugins/sass.ts";
import onedrive from "./lume/plugins/onedrive.ts";
import { onedriveConfig } from "./config/onedriveConfig.ts";

const site = lume(
    {
        src: "./site",
        dest: "./output",
    }
)

.use(picture())
.use(
    transformImages(
        {
            cache: ".cache/images"
        }
    )
)

.use(sass())

.use(await onedrive({share: onedriveConfig.share}))

.filter(
    "limit",
    (array, limit) => {
        return array.slice(0, limit);
    }
)

.filter(
    "shuffle",
    (images) => {
        return [...images].map( (_, i, copy) => {
          const rand = i + ( Math.floor( Math.random() * (copy.length - i) ) );
          [copy[rand], copy[i]] = [copy[i], copy[rand]]
          return copy[i]
      });
    }
)

.filter(
    "trimExtension",
    (value) => {
        return value.replace(/\.[^/.]+$/, "");
    }
);

export default site;
