export const COUPLE = { a: 'Blake', b: 'Ryan', monogram: 'B & R' }

// Saturday, June 5, 2027 · 4:30 PM Eastern (EDT = UTC-4)
export const WEDDING_DATE = new Date('2027-06-05T16:30:00-04:00')

export const VENUE = {
  name: 'Hollow Oak Farm',
  line1: '1240 Old Post Road',
  line2: 'Bedford, New York 10506',
  maps: 'https://www.google.com/maps/search/?api=1&query=Bedford%2C+New+York+10506',
}

export const STORY = [
  { img: './photos/story-1.jpg', year: '2010', title: 'A first hello', note: 'Two strangers, one long day, and a joke that landed.' },
  { img: './photos/story-2.jpg', year: '2011', title: 'Out in the world', note: 'Our first big night out. She wore the flowers; he wore the nerves.' },
  { img: './photos/story-3.jpg', year: '2012', title: 'Grinning like fools', note: 'The summer we stopped pretending this was casual.' },
  { img: './photos/story-4.jpg', year: '2014', title: 'Dressed for the occasion', note: 'Every big night is better when you have someone to lean on.' },
  { img: './photos/story-5.jpg', year: '2017', title: 'Hand in hand', note: 'Somewhere along the way, home became a person.' },
  { img: './photos/story-6.jpg', year: '2026', title: 'The yes', note: 'A walk down the farm lane, a ring in a coat pocket, and a very quick yes.' },
]

// The road in — each stop along the guest's journey.
export const STOPS = [
  { time: '3:30 PM', place: 'The Gate', title: 'Arrival & lemonade', text: 'Shuttles pull up beneath the old oaks. Cold lemonade and a shaded lawn while everyone finds their way in.', icon: 'gate' },
  { time: '4:30 PM', place: 'The Walled Garden', title: 'Ceremony', text: 'Vows among the climbing roses. It is short, sweet, and outdoors, so please be seated by 4:20.', icon: 'arch' },
  { time: '5:15 PM', place: 'The Orchard', title: 'Cocktails & lawn games', text: 'Local cider, a raw bar, and croquet under the apple trees as the light turns golden.', icon: 'glass' },
  { time: '7:00 PM', place: 'The Long Table', title: 'Dinner', text: 'One very long table set in the meadow. Family-style supper from the farm kitchen, toasts at dusk.', icon: 'table' },
  { time: '9:00 PM', place: 'The Old Barn', title: 'Dancing', text: 'A live string band to start, a DJ to finish. The barn doors stay open to the night air.', icon: 'barn' },
  { time: '11:30 PM', place: 'The Lane', title: 'Sparkler send-off', text: 'We light the lane and send each other home. Last shuttles leave at midnight.', icon: 'spark' },
]

export const WEEKEND = [
  { day: 'Friday · June 4', title: 'Welcome supper', text: 'Pizza from the wood oven at the Mill House Inn, 7 – 10 PM. Come as you are.' },
  { day: 'Saturday · June 5', title: 'The wedding', text: 'Hollow Oak Farm, from 3:30 PM until the sparklers.' },
  { day: 'Sunday · June 6', title: 'Farewell brunch', text: 'Coffee, biscuits and slow goodbyes on the farmhouse porch, 10 AM – noon.' },
]

export const NOTES = [
  {
    id: 'stay',
    label: 'Where to stay',
    title: 'Accommodation',
    body: [
      'We hold a room block at The Mill House Inn, ten minutes from the farm. Mention "Blake & Ryan" for our rate, which closes May 1, 2027.',
      'Prefer something smaller? The Bedford Post and a handful of country cottages are listed on the farm’s guest page; we are happy to help.',
    ],
  },
  {
    id: 'travel',
    label: 'Getting here',
    title: 'Travel & transport',
    body: [
      'Fly into Westchester (HPN, 20 min) or LaGuardia (LGA, 1 hr). By train, take Metro-North’s Harlem Line to Bedford Hills.',
      'Shuttles leave The Mill House Inn at 2:45 and 3:15 PM and run back from 10 PM until midnight. Please leave the driving to us.',
    ],
  },
  {
    id: 'weather',
    label: 'Weather',
    title: 'If it rains',
    body: [
      'Early June in Bedford is usually warm by day (around 75°F) and cool after sunset.',
      'If the sky has other ideas, the ceremony moves into the Old Barn, and nothing else changes. Umbrellas will be waiting at the gate.',
    ],
  },
  {
    id: 'kids',
    label: 'Little ones',
    title: 'Children',
    body: ['We love your little ones, and this is an adults-only celebration so everyone can stay out late. Nursing babies are, of course, welcome.'],
  },
  {
    id: 'phones',
    label: 'Phones',
    title: 'An unplugged ceremony',
    body: ['Our photographer has the ceremony covered. Please keep phones tucked away until we are married, then snap away all evening.'],
  },
  {
    id: 'parking',
    label: 'Parking',
    title: 'If you drive',
    body: ['Free parking in the lower meadow by the gate. Ushers will point the way. Cars may stay overnight and be collected by noon Sunday.'],
  },
]

export const PALETTE = [
  { name: 'Sage', hex: '#9caa8b' },
  { name: 'Oat', hex: '#d9cbb0' },
  { name: 'Clay', hex: '#b9805f' },
  { name: 'Wheat', hex: '#d8b673' },
  { name: 'Dusk blue', hex: '#8796a8' },
  { name: 'Moss', hex: '#5f6b4b' },
]

export const REGISTRY = [
  {
    id: 'honeymoon',
    seed: 'Wanderlust',
    title: 'The Honeymoon Fund',
    text: 'Two weeks on the coast of Portugal: long lunches, small boats, no phones.',
    cta: 'Contribute',
    href: 'https://www.zola.com/',
    tint: '#c9a97a',
  },
  {
    id: 'home',
    seed: 'Hearth',
    title: 'For the Farmhouse',
    text: 'Linen, pottery and a few good pans for the kitchen we are slowly filling.',
    cta: 'View registry',
    href: 'https://www.zola.com/',
    tint: '#a3ae8f',
  },
  {
    id: 'orchard',
    seed: 'Heirloom Apple',
    title: 'The Orchard Fund',
    text: 'Help us plant twelve heirloom apple trees on the farm, one for every month we waited.',
    cta: 'Plant a tree',
    href: 'https://www.zola.com/',
    tint: '#c99780',
  },
]
