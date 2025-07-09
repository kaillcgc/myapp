<template>
  <!-- 仅保留内容区，依赖全局布局的导航 -->
  <el-main class="content">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h2 style="margin: 0;">新闻管理</h2>
      <el-button type="primary" icon="el-icon-plus" @click="goToPublish">发布新闻</el-button>
    </div>
    <el-table :data="newsList" border style="width: 100%;">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="新闻标题" prop="title"></el-table-column>
      <el-table-column label="发布时间" prop="time"></el-table-column>
      <!-- 合并操作列，优化按钮区分度 -->
      <el-table-column label="操作">
        <template #default="scope">
          <!-- 修改按钮：黄色 + 编辑图标 + 文字 -->
          <el-button 
            type="warning" 
            icon="el-icon-edit" 
            size="mini" 
            @click="editNews(scope.row)"
            style="margin-right: 8px;"
          >
            修改
          </el-button>
          <!-- 删除按钮：红色 + 删除图标 + 文字 -->
          <el-button 
            type="danger" 
            icon="el-icon-delete" 
            size="mini" 
            @click="deleteNews(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-main>
</template>