<template>
	<main class="workflow">
      <aside class="aside-left">
       
        <orederbook
        ></orederbook>

        <chat></chat>
      </aside>
      <div class="charts">
        <chart></chart>
        <depth></depth>
      </div>
      <aside class="aside-right">
        <history></history>

        <forms 
          :from="from" 
          :check="test">
            
        </forms>

      </aside>
    </main>
</template>

<script>
	
	export default {

		
	}
</script>