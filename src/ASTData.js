const s_LOG_PREPEND = 'tjsdoc-publisher-raw-data-ast - ';

/**
 * Executes writing AST output.
 *
 * @param {PluginEvent} ev - The plugin event.
 */
export function onHandlePublishAsync(ev)
{
   if (ev.data.incremental)
   {
      if (ev.data.fileType === 'source') { ASTData.exec(ev.data); }
   }
   else
   {
      ASTData.exec(ev.data);
   }
}

/**
 * Internal implementation
 */
class ASTData
{
   /**
    * Executes writing AST output.
    */
   static exec({ docDB, eventbus, filePath, mainConfig, silent } = {})
   {
      if (mainConfig.outputASTData)
      {
         // Note the compression format extension will automatically be added.
         if (mainConfig.compressData)
         {
            eventbus.trigger('tjsdoc:system:file:archive:create', {
               filePath: 'ast',
               addToParent: true,
               logPrepend: s_LOG_PREPEND,
               silent
            });
         }

         // Write AST for all file data.
         const fileDocs = docDB.findSorted('__docId__ asec', filePath ? { kind: 'ModuleFile', filePath } :
          { kind: 'ModuleFile' });

         for (const doc of fileDocs)
         {
            const fileData = mainConfig.compactData ? JSON.stringify(doc.node) : JSON.stringify(doc.node, null, 3);
            const filePath = `ast/${doc.filePath}.json`;

            eventbus.trigger('tjsdoc:system:file:write', { fileData, filePath, logPrepend: s_LOG_PREPEND, silent });
         }

         if (mainConfig.compressData)
         {
            eventbus.trigger('typhonjs:util:file:archive:finalize', { logPrepend: s_LOG_PREPEND });
         }
      }
   }
}
