// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { NgModule } from '@angular/core';

import { CoreFileUploaderDelegate } from './services/fileuploader-delegate';
import { CoreFileUploaderAlbumHandler } from './services/handlers/album';
import { CoreFileUploaderAudioHandler } from './services/handlers/audio';
import { CoreFileUploaderCameraHandler } from './services/handlers/camera';
import { CoreFileUploaderFileHandler } from './services/handlers/file';
import { CoreFileUploaderVideoHandler } from './services/handlers/video';


@NgModule({
    imports: [],
    declarations: [],
    providers: [
        CoreFileUploaderAlbumHandler,
        CoreFileUploaderAudioHandler,
        CoreFileUploaderCameraHandler,
        CoreFileUploaderFileHandler,
        CoreFileUploaderVideoHandler,
    ],
})
export class CoreFileUploaderModule {

    constructor(
        delegate: CoreFileUploaderDelegate,
        albumHandler: CoreFileUploaderAlbumHandler,
        audioHandler: CoreFileUploaderAudioHandler,
        cameraHandler: CoreFileUploaderCameraHandler,
        videoHandler: CoreFileUploaderVideoHandler,
        fileHandler: CoreFileUploaderFileHandler,
    ) {
        delegate.registerHandler(albumHandler);
        delegate.registerHandler(audioHandler);
        delegate.registerHandler(cameraHandler);
        delegate.registerHandler(videoHandler);
        delegate.registerHandler(fileHandler);
    }

}