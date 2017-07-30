const s_LOG_PREPEND = 'tjsdoc-publisher-raw-data-docdb - ';

/**
 * Executes writing doc data.
 *
 * @param {PluginEvent} ev - The plugin event.
 */
export function onHandlePublishAsync(ev)
{
   if (!ev.data.incremental) { DocData.exec(ev.data); }
}

/**
 * Doc Data Output Builder.
 *
 * The doc data from the given DocDB is output to `docData.json`.
 */
class DocData
{
   /**
    * Executes writing AST output.
    */
   static exec({ docDB, eventbus, mainConfig, silent } = {})
   {
      if (mainConfig.outputDocData)
      {
         // Write doc data as JSON to 'docData.json'
         const docData = docDB.findSorted('__docId__ asec');

         // Filter out AST node and TaffyDB private data.
         const filterNode = (key, value) => key === 'node' || key === '___id' || key === '___s' ? void 0 : value;

         const fileData = mainConfig.compactData ? JSON.stringify(docData, filterNode) :
          JSON.stringify(docData, filterNode, 3);

         // Note the compression format extension will automatically be added.
         if (mainConfig.compressData)
         {
            eventbus.trigger('tjsdoc:system:file:archive:create', { filePath: 'docData', logPrepend: s_LOG_PREPEND });
         }

         eventbus.trigger('tjsdoc:system:file:write', {
            fileData,
            filePath: 'docData.json',
            logPrepend: s_LOG_PREPEND,
            silent
         });

         if (mainConfig.compressData)
         {
            eventbus.trigger('typhonjs:util:file:archive:finalize', { logPrepend: s_LOG_PREPEND });
         }
      }
   }
}
