
// Fallback for using MaterialIcons on Android and web.

import React, { JSX , ComponentProps } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
export type IconSymbolName = keyof typeof MAPPING;

type IconSymbolProps = {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
};

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'house': 'home',
  'paperplane.fill': 'send',
  'paperplane': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'chevron.down': 'keyboard-arrow-down',
  'camera.fill': 'camera-alt',
  'camera': 'camera',
  'camera.viewfinder': 'camera',
  'car.fill': 'directions-car',
  'car': 'directions-car',
  'car.2.fill': 'directions-car',
  'person.fill': 'person',
  'person': 'person',
  'person.circle.fill': 'account-circle',
  'person.2.fill': 'group',
  'person.2': 'group',
  'person.3.fill': 'group',
  'magnifyingglass': 'search',
  'xmark': 'close',
  'xmark.circle.fill': 'cancel',
  'line.3.horizontal.decrease': 'filter-list',
  'funnel': 'filter-alt',
  'bag.fill': 'shopping-bag',
  'bag': 'shopping-bag',
  'airplane': 'flight',
  'map.fill': 'map',
  'map': 'map',
  'sparkles': 'auto-awesome',
  'viewfinder.circle.fill': 'my-location',
  'viewfinder.circle': 'location-searching',
  'viewfinder': 'center-focus-strong',
  'star.fill': 'star',
  'star': 'star',
  'sun.max.fill': 'wb-sunny',
  'moon.fill': 'nightlight-round',
  'bell.fill': 'notifications',
  'bell.slash.fill': 'notifications-off',
  'bell': 'notifications',
  'globe': 'public',
  'arrow.right.square': 'arrow-forward',
  'arrow.right': 'arrow-forward',
  'arrow.up.right': 'north-east',
  'arrow.up': 'keyboard-arrow-up',
  'arrow.down.circle': 'south',
  'arrow.left.arrow.right': 'swap-horiz',
  'arrow.clockwise': 'refresh',
  'arrow.triangle.2.circlepath': 'sync',
  'arrow.triangle.turn.up.right.diamond.fill': 'turn-right',
  'arrow.turn.up.right': 'turn-right',
  'building.2.fill': 'business',
  'building.2': 'business',
  'clock.fill': 'schedule',
  'clock': 'schedule',
  'tag.fill': 'local-offer',
  'location.fill': 'place',
  'location': 'place',
  'location.circle': 'location-on',
  'location.north.line.fill': 'navigation',
  'gear': 'settings',
  'info.circle.fill': 'info',
  'info.circle': 'info',
  'stop.fill': 'stop',
  'play.fill': 'play-arrow',
  'play.circle': 'play-circle-filled',
  'pause.circle': 'pause-circle-filled',
  'creditcard.fill': 'credit-card',
  'creditcard': 'credit-card',
  'ellipsis': 'more-horiz',
  'qrcode.viewfinder': 'qr-code-scanner',
  'qrcode': 'qr-code',
  'cart': 'shopping-cart',
  'chart.bar.fill': 'bar-chart',
  'cube.box.fill': 'inventory',
  'cross.fill': 'local-hospital',
  'graduationcap.fill': 'school',
  'flag.fill': 'flag',
  'wifi': 'wifi',
  'wifi.slash': 'wifi-off',
  'battery.100': 'battery-full',
  'photo': 'photo',
  'photo.fill': 'photo',
  'bookmark': 'bookmark-border',
  'bookmark.fill': 'bookmark',
  'message': 'message',
  'message.fill': 'message',
  'message.circle': 'chat-bubble',
  'exclamationmark.triangle': 'warning',
  'exclamationmark.triangle.fill': 'warning',
  'exclamationmark.circle.fill': 'error',
  'square.and.arrow.up': 'share',
  'wand.and.stars': 'auto-fix-high',
  'bolt.fill': 'flash-on',
  'calendar': 'event',
  'questionmark.circle': 'help',
  'questionmark': 'help-outline',
  'checkmark.circle.fill': 'check-circle',
  'checkmark': 'check',
  'phone.fill': 'phone',
  'storefront': 'storefront',
  'megaphone.fill': 'campaign',
  'mappin.circle.fill': 'place',
  'accessibility': 'accessibility',
  'search': 'search',
  'close': 'close',
  'plus': 'add',
  'plus.circle': 'add-circle',
  'list': 'list',
  'grid.3x3': 'grid-view',
  'eye': 'visibility',
  'eye.slash': 'visibility-off',
  'eye.fill': 'visibility',
  'lock.fill': 'lock',
  'trash.fill': 'delete',
  'gift': 'card-giftcard',
  'gift.fill': 'card-giftcard',
  'brain.head.profile': 'psychology',
  'lightbulb': 'lightbulb-outline',
  'lightbulb.fill': 'lightbulb',
  'doc.text.viewfinder': 'document-scanner',
  'arkit': 'view-in-ar',
  'suitcase': 'work',
  'list.bullet': 'format-list-bulleted',
  'leaf': 'eco',
} as const;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: IconSymbolProps): JSX.Element {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
