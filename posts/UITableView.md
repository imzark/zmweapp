---
title: UITableView
date: 2017-07-27 09:44:47
tags: iOS
categories: iOS

---

Apple Developer Document 阅读，UITableView部分查缺补漏。

<!--more-->

# **Overview**

> UITableView is a subclass of UIScrollView, which allows users to scroll through the table, although UITableView allows vertical scrolling only. 

`UITableView` 是 `UIScrollView` 的子类，但 `UITableView` 只能竖着滚动。

> Any section can optionally be preceded by a section header, and optionally be followed by a section footer.

`Section` 可以选择性的设置 `header` 和 `footer`。

> Table views can have one of two styles, UITableViewStylePlain and UITableViewStyleGrouped. When you create a UITableView instance you must specify a table style, and this style cannot be changed.
> 
> ……
> 
> Table views in the grouped style cannot have an index.

表视图有两种样式：`UITableViewStylePlain` 和 `UITableViewStyleGrouped`， 在创建 UITableView 时必须指定其中一种，且后续不能改变。

`UITableViewStylePlain` 样式可以有右侧的索引视图（如 A-Z），而 `UITableViewStyleGrouped` 不可以有索引。

> When sent a setEditing:animated: message (with a first parameter of YES), the table view enters into editing mode where it shows the editing or reordering controls of each visible row, depending on the editingStyle of each associated UITableViewCell. Clicking on the insertion or deletion control causes the data source to receive a tableView:commitEditingStyle:forRowAtIndexPath: message. You commit a deletion or insertion by calling deleteRowsAtIndexPaths:withRowAnimation: or insertRowsAtIndexPaths:withRowAnimation:, as appropriate. Also in editing mode, if a table-view cell has its showsReorderControl property set to YES, the data source receives a tableView:moveRowAtIndexPath:toIndexPath: message. The data source can selectively remove the reordering control for cells by implementing tableView:canMoveRowAtIndexPath:. 

使用 `setEditing:animated:` 方法时，table view 进入编辑模式，可以根据相关 cell 的 `editingStyle` 编辑或重新排序表视图中的 cell。插入或删除操作将使 data source 收到 `tableView:commitEditingStyle:forRowAtIndexPath:` 消息。你通过  `deleteRowsAtIndexPaths:withRowAnimation:` 或  `insertRowsAtIndexPaths:withRowAnimation:` 来进行插入删除的确认。类似的如果 cell 设置 `showsReorderControl` 属性为 `YES`，data source 会收到 `tableView:moveRowAtIndexPath:toIndexPath` 消息。不过 data source 可以通过实现 `tableView:canMoveRowAtIndexPath` 选择性的移除某些 cells 的重新排列控制。

> UITableView caches table-view cells for visible rows. You can create custom UITableViewCell objects with content or behavioral characteristics that are different than the default cells; A Closer Look at Table View Cells explains how.

[A Closer Look at Table View Cells](https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/TableView_iPhone/TableViewCells/TableViewCells.html) 演示了如何自定义 UITableViewCell。

> UITableView overrides the layoutSubviews method of UIView so that it calls reloadData only when you create a new instance of UITableView or when you assign a new data source. Reloading the table view clears current state, including the current selection. However, if you explicitly call reloadData, it clears this state and any subsequent direct or indirect call to layoutSubviews does not trigger a reload.

UITableView 覆写了 UIView的 `layoutSubviews` 方法，所以当你创建一个新的 UITableView 实例或指派一个新的 data source 的同时，`reloadData` 方法将被使用。Reloading table view 会清空当前状态，包括当前已选状态。但是如果你主动使用 `reloadData`，它会清空当前状态并且任何随后的直接或间接使用 `layoutSubviews` 都不会导致 reload（似乎是reloadData就已经重新 layout subviews 了）。

## *State Preservation*

UITableView 在应用退出和唤醒时的状态保存与恢复，日后需要时再看，目前没太看懂。。。





# **Configuring a Table View**

## #1 **`style`**

*Returns the style of the table view.*

*table view 的样式*

### Declaration

```
@property(nonatomic, readonly) UITableViewStyle style;
```

### Discussion

See `UITableViewStyle` for descriptions of the constants used to specify table-view style.

```
typedef enum UITableViewStyle : NSInteger {
    UITableViewStylePlain,  //  正常样式
    UITableViewStyleGrouped  //  每个Section之间会有间距的样式
} UITableViewStyle;
```



## #2 **`separatorStyle`**

*The style for table cells used as separators.*

*table cells 分割线样式*

### Declaration

```
@property(nonatomic) UITableViewCellSeparatorStyle separatorStyle;
```

### Discussion

>The value of this property is one of the separator-style constants described in `UITableViewCell`. `UITableView` uses this property to set the separator style on the cell returned from the delegate in `tableView:cellForRowAtIndexPath:`.

**`separatorStyle`** 属性在 `UITableViewCell` 中被描述（是 `UITableViewCell` 中的常量 `Constants`），`UITableView` 通过该 **`@property`** 在方法 `tableView:cellForRowAtIndexPath:` 中统一设置 cell 的分割线样式

### 补充

样式枚举

```
typedef enum UITableViewCellSeparatorStyle : NSInteger {
    UITableViewCellSeparatorStyleNone,
    UITableViewCellSeparatorStyleSingleLine,
    UITableViewCellSeparatorStyleSingleLineEtched
} UITableViewCellSeparatorStyle;
```



## #3 **`separatorEffect`**

*The effect applied to table separators.*

*分割线毛玻璃效果*

### Declaration

```
@property(nonatomic, copy) UIVisualEffect *separatorEffect;
```

### Usage

```
tableview.backgroundView = [[UIImageView alloc]initWithImage:[UIImage imageNamed:@"detail.jpg"]];
UIBlurEffect *blurEffect = [UIBlurEffect effectWithStyle:UIBlurEffectStyleDark];
UIVibrancyEffect *vibrancyEffect = [UIVibrancyEffect effectForBlurEffect:blurEffect];
tableview.separatorEffect = vibrancyEffect;
```

为 tableView 设置一张背景图，然后通过 UIBlurEffect [蒙层效果]创建一个对象赋给 tableView 的 separatorEffect 属性，并且将 Cell 的背景色设置为clearColor,即可获得非常酷炫的半透明 Cell 效果了。

> http://blog.csdn.net/lengshengren/article/details/44243119
> http://www.jianshu.com/p/8be5952c12ab

*（待考察）*



## #4 **`backgroundView`**

*The background view of the table view.*

*设置整个表视图的背景图层*

### Declaration

```
@property(nonatomic, strong) UIView *backgroundView;
```

### Discussion

>A table view’s background view is automatically resized to match the size of the table view. This view is placed as a subview of the table view behind all cells, header views, and footer views.

>You must set this property to nil to set the background color of the table view.

表视图的 `backgroundView` 会自适应 table view 的大小。`backgroundView` 会放在表视图所有 cells、header views、footer views 的下面。

当你需要设置 table view 的背景色时，必须置该属性为 nil。



## #5 **`separatorInset`**

*Specifies the default inset of cell separators.*

*设置 cell separators 的默认 inset*

### Declaration

```
@property(nonatomic) UIEdgeInsets separatorInset;
```

### Discussion

> ……

> `tableView.separatorInset = UIEdgeInsetsMake(0, 3, 0, 11);
`

> If every cell in a table contains an image view of the same size, by default iOS vertically aligns the leading edge of all separators. In a table that mixes text-only cells with cells that contain image views, you can use the separatorInset property to ensure that the separators are vertically aligned.

> In a right-to-left user interface, an inset that you set using the separatorInset property automatically flips its left and right measurements.
 
如果每个 cell 都有一个相同 size 的 image view，那么 iOS 会默认垂直方向对齐所有 separators 的前边缘。在一个混合了 text-only 的 cell 和 包含 image view 的 cell 的表格视图中，你可以使用该属性**`separatorInset`**确保分割线垂直对齐。

（待实验）

左撇子手机模式时，分割线会自行翻转。



## #6 **`cellLayoutMarginsFollowReadableWidth`**

*A Boolean value that indicates whether the cell margins are derived from the width of the readable content guide.*

*布尔值，cell 两侧边缘是否遵循「阅读模式」*

### Declaration

```
@property(nonatomic) BOOL cellLayoutMarginsFollowReadableWidth;
```

### Note

> 相信很多开发者在把应用迁移到iOS 9的时候发现了如下现象。那就是TableView在iOS 9的iPad或iPhone 6 Plus的横屏模式时，表格两边有巨大的空白边缘。
> 
> 这是因为iOS 9为UIView引入了一个新的属性readableContentGuide，这个属性为View定义了一个可以放置用于阅读的内容的最佳区域。如果启用readableContentGuide的话，那么View就会把它作为边缘进行布局。
> 
> http://cocoa.venj.me/blog/ios9-readable-content-guide/

# **Creating Table View Cells**

## #1 `- registerClass:forCellReuseIdentifier:`

### Discussion

> If a cell of the specified type is not currently in a reuse queue, the table view uses the provided information to create a new cell object automatically.

> If you previously registered a class or nib file with the same reuse identifier, the class you specify in the cellClass parameter replaces the old entry. You may specify nil for cellClass if you want to unregister the class from the specified reuse identifier.

如果一个 Cell 不在复用队列，table view将会利用这个方法提供的信息创建一个新的 Cell 对象。

如果注册了相同的复用 identifier，新的会替代旧的。可以给注册的 cell 类的复用 identifier 指定 nil 来 unregister。

## #2 `- dequeueReusableCellWithIdentifier:forIndexPath:`

### Declaration

```
- (__kindof UITableViewCell *)dequeueReusableCellWithIdentifier:(NSString *)identifier forIndexPath:(NSIndexPath *)indexPath;
```

### Discussion

> If you registered a class for the specified identifier and a new cell must be created, this method initializes the cell by calling its initWithStyle:reuseIdentifier: method. For nib-based cells, this method loads the cell object from the provided nib file. If an existing cell was available for reuse, this method calls the cell’s prepareForReuse method instead.
 
当一个新的 cell 必须被创建时，本方法会调用 cell 的 `initWithStyle:reuseIdentifier:` 方法。如果一个存在的 cell 可被复用，那么本方法调用 cell 的 `prepareForReuse` 方法 instead。

## #3 `- dequeueReusableCellWithIdentifier:`

*Returns a reusable table-view cell object located by its identifier.*

# **Accessing Header and Footer Views**

## #1 `- registerClass:forHeaderFooterViewReuseIdentifier:`

*Registers a class for use in creating new table header or footer views.*

## #2 `- dequeueReusableHeaderFooterViewWithIdentifier:`

*Returns a reusable header or footer view located by its identifier.*

## #3 `@property(nonatomic, strong) UIView *tableHeaderView;`

*Returns an accessory view that is displayed above the table.*

## #4 `@property(nonatomic, strong) UIView *tableFooterView;`

*Returns an accessory view that is displayed below the table.*

## #5 `@property(nonatomic) CGFloat sectionHeaderHeight;`

*The height of section headers in the table view.*

### Discussion

> This nonnegative value is used only in section group tables and only if the delegate doesn't implement the `tableView:heightForFooterInSection:` method. 

只有当 delegate 没有实现 `tableView:heightForFooterInSection:` 方法，并且 table view 是 group 样式时，这个属性才有用。

（同理 `@property(nonatomic) CGFloat sectionFooterHeight;`）

## #6 `- headerViewForSection:`

*Returns the header view associated with the specified section.*

## #7 `- footerViewForSection:`

*Returns the footer view associated with the specified section.*

# **Accessing Cells and Sections**

## #1 `- indexPathForCell:`

*Returns an index path representing the row and section of a given table-view cell.*

不过似乎只有当 cell 处于 visible 状态时方法才有用。

> It could be that the cell is not visible at this moment. tableView:indexPathForCell returns nil in this situation. I solved this using indexPathForRowAtPoint this method works even if the cell is not visible. The code:

> ```
UITableViewCell *cell = textField.superview.superview;
NSIndexPath *indexPath = [self.tableView indexPathForRowAtPoint:cell.center];
```
> —— stackoverflow
 
意思是推荐使用 `-indexPathForRowAtPoint:` 方法。

## #2 `- indexPathForRowAtPoint:`

*Returns an index path identifying the row and section at the given point.*

## #3 `- indexPathsForRowsInRect:`

*An array of index paths each representing a row enclosed by a given rectangle.*

## #4 `visibleCells`

### Declaration

```
@property(nonatomic, readonly) NSArray<__kindof UITableViewCell *> *visibleCells;
```

## #5 `indexPathsForVisibleRows`

### Declaration

```
@property(nonatomic, readonly) NSArray<NSIndexPath *> *indexPathsForVisibleRows;
```

# **Scrolling the Table View**

## #1 `- scrollToRowAtIndexPath:atScrollPosition:animated:`

### Discussion

> Invoking this method does not cause the delegate to receive a `scrollViewDidScroll:` message, as is normal for programmatically invoked user interface operations.

调用本方法不会使得 delegate 收到 `scrollViewDidScroll:` 信息。

### 补充

```
typedef enum UITableViewScrollPosition : NSInteger {
    UITableViewScrollPositionNone,
    UITableViewScrollPositionTop,
    UITableViewScrollPositionMiddle,
    UITableViewScrollPositionBottom
} UITableViewScrollPosition;
```

## #2 `- scrollToNearestSelectedRowAtScrollPosition:animated:`

*Scrolls the table view so that the selected row nearest to a specified position in the table view is at that position.*

# **Managing Selections**

## #1 `indexPathsForSelectedRow`

### Declaration

```
@property(nonatomic, readonly) NSIndexPath *indexPathForSelectedRow;
```

### Discussion

返回 indexPath 或 nil。如果有多选 cells 那么返回的是第一个，也就是有最小的 section 和 row 的 indexPath。

## #2 `indexPathsForSelectedRows`

## #3 `- selectRowAtIndexPath:animated:scrollPosition:`

###  Discussion 

> Calling this method does not cause the delegate to receive a tableView:willSelectRowAtIndexPath: or tableView:didSelectRowAtIndexPath: message, nor does it send UITableViewSelectionDidChangeNotification notifications to observers.

方法不会使 delegate 收到 `tableView:willSelectRowAtIndexPath:` or `tableView:didSelectRowAtIndexPath:` 消息，也不会发送 `UITableViewSelectionDidChangeNotification` 给观察者。

### Special Considerations

使用 `UITableViewScrollPositionNone` 参数将导致选择后却不滚动，虽然这个常量描述说使用它会是最小滚动（minimum scrolling）。所以为了使用本方法后（仅当使用`UITableViewScrollPositionNone` 参数时），滚动到相应位置，这么写：

```
NSIndexPath *rowToSelect;  // assume this exists and is set properly
UITableView *myTableView;  // assume this exists
 
[myTableView selectRowAtIndexPath:rowToSelect animated:YES scrollPosition:UITableViewScrollPositionNone];
[myTableView scrollToRowAtIndexPath:rowToSelect atScrollPosition:UITableViewScrollPositionNone animated:YES];
```

先选再手动滚。

## #4 `- deselectRowAtIndexPath:animated:`

同样调用该方法不会使 delegate 收到相应的 will、did 方法，也不会通知观察者。

## #5 `allowsSelection`

*A Boolean value that determines whether users can select a row.*

## #6 `allowsMultipleSelection`

*A Boolean value that determines whether users can select more than one row outside of editing mode.*

## #7 `allowsSelectionDuringEditing`

*A Boolean value that determines whether users can select cells while the table view is in editing mode.*

## #8 `allowsMultipleSelectionDuringEditing`

*A Boolean value that controls whether users can select more than one cell simultaneously in editing mode.*

# *Inserting, Deleting, and Moving Rows and Sections*

## #1 `- beginUpdates`

*Begins a series of method calls that insert, delete, or select rows and sections of the table view.

## #2 `- endUpdates`

与上面的是一对。

## #3 `- insertRowsAtIndexPaths:withRowAnimation:`

记住与增加数据源 `[_dataSource insertObject:@"someObject" atIndex:indexPath.row];` 一起使用。 

# **Reloading the Table View**

## #1 `- reloadData`

### Discussion

> Call this method to reload all the data that is used to construct the table, including cells, section headers and footers, index arrays, and so on. 
 
这个方法会重载所有信息包括：结构、cells、头脚视图、索引数组等等。

> For efficiency, the table view redisplays only those rows that are visible. 

效率起见，table view **只会重载当前可见的行**！ 

> The table view’s delegate or data source calls this method when it wants the table view to completely reload its data.

Delegate & data source 想要重载数据时会呼叫本方法。

> It should not be called in the methods that insert or delete rows, especially within an animation block implemented with calls to beginUpdates and endUpdates.

在插入或删除 rows 时不应该呼叫本方法，**尤其是**在用 `beginUpdates` 和 `endUpdates` 方法实现动画 block 中，不要使用 `reloadData`。

## #2 `- reloadRowsAtIndexPaths:withRowAnimation:`

### Discussion

> When this method is called in an animation block defined by the beginUpdates and endUpdates methods, it behaves similarly to deleteRowsAtIndexPaths:withRowAnimation:. 


## #3 `- reloadSections:withRowAnimation:`

### Discussion

> When this method is called in an animation block defined by the beginUpdates and endUpdates methods, it behaves similarly to deleteSections:withRowAnimation:. 

## #4 `- reloadSectionIndexTitles`

### Discussion

> This method gives you a way to update the section index after inserting or deleting sections without having to reload the whole table.

当插入或删除 sections 而更新了 section 的索引时，这个方法实现了更新 section index 而不用非得更新整个 table。

# **Accessing Drawing Areas of the Table View**

## #1 `- rectForSection:`

*Returns the drawing area for a specified section of the table view.*

## #2 `- rectForRowAtIndexPath:`

*Returns the drawing area for a row identified by index path.*

## #3 `- rectForFooterInSection:`

*Returns the drawing area for the footer of the specified section.*

## #4 `- rectForHeaderInSection:`

*Returns the drawing area for the header of the specified section.*

# **Prefetching Data**

> If your table view relies on an expensive data loading process, you can improve your user experience by prefetching data before it is needed for display. Assign an object that conforms to the `UITableViewDataSourcePrefetching` protocol to the `prefetchDataSource` property to receive notifications of when to prefetch data for cells.

表数据下载进程开销较大时，可以采用 `UITableViewDataSourcePrefetching` 协议来提升用户体验。

## #1 prefetchDataSource

*The object that acts as the prefetching data source for the table view, receiving notifications of upcoming cell data requirements.*

# **Managing Focus**

## #1 remembersLastFocusedIndexPath

*A Boolean value that indicates whether the table view should automatically return the focus to the cell at the last focused index path.*

啥玩意啊？

### Declaration

```
@property(nonatomic) BOOL remembersLastFocusedIndexPath;
```

# Notifications

## #1 `UITableViewSelectionDidChangeNotification`

*Posted when the selected row in the posting table view changes.*



