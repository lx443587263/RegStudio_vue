<template>
    <div class="version-node">
        <div class="version-info">{{ version.name }}</div>
        <div v-if="version.children" class="version-children" >
            <version-node v-for="child in version.children" :key="child.id" :version="child" />
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'VersionNode',
    props: {
        version: {
            type: Object,
            required: true,
        },
    },
};
</script>
  
<style>
.version-node {
    margin-left: 10px;
}

.version-info {
    font-weight: bold;
}

.version-children {
    margin-top: 5px;
}
</style>
  