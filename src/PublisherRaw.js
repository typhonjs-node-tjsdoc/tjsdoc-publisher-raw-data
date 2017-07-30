/**
 * Adds all raw data publisher plugins.
 */
export default class PublisherRaw
{
   /**
    * Adds all raw data publisher plugins.
    *
    * @param {PluginEvent} ev - The plugin event.
    */
   static async onPluginLoad(ev)
   {
      const eventbus = ev.eventbus;

      await eventbus.triggerAsync('plugins:async:add:all', [
         { name: 'tjsdoc-publisher-raw-data-ast', instance: require('./ASTData') },
         { name: 'tjsdoc-publisher-raw-data-docdb', instance: require('./DocData') },
      ]);

      // Instances are being loaded into the plugin manager so auto log filtering needs an explicit filter.
      eventbus.trigger('log:filter:add',
      {
         type: 'inclusive',
         name: 'tjsdoc-publisher-raw-data',
         filterString: '(tjsdoc-publisher-raw-data\/dist|tjsdoc-publisher-raw-data\/src)'
      });
   }
}
