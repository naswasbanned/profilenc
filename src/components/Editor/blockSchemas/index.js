import cardsGrid from './cardsGrid';
import events from './events';
import featuredVideo from './featuredVideo';
import gallery from './gallery';
import githubHeatmap from './githubHeatmap';
import hero from './hero';
import journal from './journal';
import mediaReviews from './mediaReviews';
import milestones from './milestones';
import musicPlayer from './musicPlayer';
import services from './services';
import skills from './skills';
import specsGrid from './specsGrid';
import stackedDeck from './stackedDeck';
import timeline from './timeline';
import videoGallery from './videoGallery';

/**
 * Registry of block editing schemas.
 *
 * Block types listed here use the guided editor (`SchemaBlockForm` with a live
 * preview and steps). Everything else still renders its hand written form from
 * `blockForms/`, so the two can live side by side.
 *
 * Every block type is covered.
 */
const SCHEMAS = {
  [hero.type]: hero,
  [cardsGrid.type]: cardsGrid,
  [timeline.type]: timeline,
  [services.type]: services,
  commission: services,
  [specsGrid.type]: specsGrid,
  [mediaReviews.type]: mediaReviews,
  [gallery.type]: gallery,
  [stackedDeck.type]: stackedDeck,
  [githubHeatmap.type]: githubHeatmap,
  [musicPlayer.type]: musicPlayer,
  [featuredVideo.type]: featuredVideo,
  video: featuredVideo,
  [videoGallery.type]: videoGallery,
  [events.type]: events,
  calendar: events,
  [skills.type]: skills,
  [milestones.type]: milestones,
  [journal.type]: journal,
};

export function getBlockSchema(type) {
  return SCHEMAS[type] || null;
}

export default SCHEMAS;
