package
{
    import flash.net.FileReference;
    import flash.utils.ByteArray;
    import flash.external.ExternalInterface;

    public class TextFileParser implements IFileParser {

        private var file_ref:FileReference;
        private var settings:Object;

        private var content:String = "";

        public function TextFileParser(file_ref:FileReference, options:Object = null) {
            if (! file_ref) {
              throw new Error("Invalid text file");
            }

            this.file_ref = file_ref;

            this.merge_settings(options, {
                id: "sequenceFile"
            });
        }

        public function parse():Object {
            var file_ref_data:ByteArray = this.file_ref.data;

            return {
              content: file_ref_data.toString()
            };
        }

        private function merge_settings(options:Object, default_options:Object):void {
            options = options || {};

            this.settings = options;

            for (var key:String in default_options) {
                if (! options[key]) {
                    this.settings[key] = default_options[key];
                }
            }
        }
    }
}
