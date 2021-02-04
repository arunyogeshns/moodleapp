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

import { Injectable } from '@angular/core';

import { CoreSites } from '@services/sites';
import { CoreUtils } from '@services/utils/utils';
import { makeSingleton } from '@singletons';
import { CoreEvents, CoreEventSiteData } from '@singletons/events';
import { CoreMainMenuHandler, CoreMainMenuHandlerData } from '@features/mainmenu/services/mainmenu-delegate';
import { CorePushNotifications } from '@features/pushnotifications/services/pushnotifications';
import { CorePushNotificationsDelegate } from '@features/pushnotifications/services/push-delegate';
import { AddonNotifications, AddonNotificationsProvider } from '../notifications';
import { AddonMessagesReadChangedEventData } from '@addons/messages/services/messages';

/**
 * Handler to inject an option into main menu.
 */
@Injectable({ providedIn: 'root' })
export class AddonNotificationsMainMenuHandlerService implements CoreMainMenuHandler {

    static readonly PAGE_NAME = 'notifications';

    name = 'AddonNotifications';
    priority = 700;

    protected handlerData: CoreMainMenuHandlerData = {
        icon: 'fas-bell',
        title: 'addon.notifications.notifications',
        page: AddonNotificationsMainMenuHandlerService.PAGE_NAME,
        class: 'addon-notifications-handler',
        showBadge: true,
        badge: '',
        loading: true,
    };

    /**
     * Initialize the handler.
     */
    initialize(): void {
        CoreEvents.on<AddonMessagesReadChangedEventData>(AddonNotificationsProvider.READ_CHANGED_EVENT, (data) => {
            this.updateBadge(data.siteId);
        });

        CoreEvents.on(AddonNotificationsProvider.READ_CRON_EVENT, (data: CoreEventSiteData) => {
            this.updateBadge(data.siteId);
        });

        // Reset info on logout.
        CoreEvents.on(CoreEvents.LOGOUT, () => {
            this.handlerData.badge = '';
            this.handlerData.loading = true;
        });

        // If a push notification is received, refresh the count.
        CorePushNotificationsDelegate.instance.on('receive').subscribe((notification) => {
            // New notification received. If it's from current site, refresh the data.
            if (CoreUtils.instance.isTrueOrOne(notification.notif) && CoreSites.instance.isCurrentSite(notification.site)) {
                this.updateBadge(notification.site);
            }
        });

        // Register Badge counter.
        CorePushNotificationsDelegate.instance.registerCounterHandler('AddonNotifications');
    }

    /**
     * Check if the handler is enabled on a site level.
     *
     * @return Whether or not the handler is enabled on a site level.
     */
    async isEnabled(): Promise<boolean> {
        return true;
    }

    /**
     * Returns the data needed to render the handler.
     *
     * @return Data needed to render the handler.
     */
    getDisplayData(): CoreMainMenuHandlerData {
        if (this.handlerData.loading) {
            this.updateBadge();
        }

        return this.handlerData;
    }

    /**
     * Triggers an update for the badge number and loading status. Mandatory if showBadge is enabled.
     *
     * @param siteId Site ID or current Site if undefined.
     * @return Promise resolved when done.
     */
    protected async updateBadge(siteId?: string): Promise<void> {
        siteId = siteId || CoreSites.instance.getCurrentSiteId();
        if (!siteId) {
            return;
        }

        try {
            const unreadCount = await AddonNotifications.instance.getUnreadNotificationsCount(undefined, siteId);

            this.handlerData.badge = unreadCount > 0 ? String(unreadCount) : '';
            CorePushNotifications.instance.updateAddonCounter('AddonNotifications', unreadCount, siteId);
        } catch {
            this.handlerData.badge = '';
        } finally {
            this.handlerData.loading = false;
        }
    }

}

export class AddonNotificationsMainMenuHandler extends makeSingleton(AddonNotificationsMainMenuHandlerService) {}