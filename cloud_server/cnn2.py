#coding=utf-8
import os
from PIL import Image
import numpy as np
import tensorflow as tf

data_dir = "data"
test_dir = "test_image"
train = True
model_path = "model/image_model"

def read_data(data_dir):
    datas = []
    labels = []
    fpaths = []
    for fname in os.listdir(data_dir):
        fpath = os.path.join(data_dir, fname)
        fpaths.append(fpath)
        image = Image.open(fpath)
        data = np.array(image) / 255.0
        label = int(fname.split("_")[0])
        datas.append(data)
        labels.append(label)
    datas = np.array(datas)
    labels = np.array(labels)
    print ("shape of datas: {}\tshape of labels: {}".format(datas.shape, labels.shape))
    return fpaths, datas, labels

fpaths, datas, labels = read_data(data_dir)

num_classes = len(set(labels))

datas_placeholder = tf.placeholder(tf.float32, [None, 32, 32, 3])
labels_placeholder = tf.placeholder(tf.int32, [None])

dropout_placeholder = tf.placeholder(tf.float32)

conv0 = tf.layers.conv2d(datas_placeholder, 20, 5, activation = tf.nn.relu)
pool0 = tf.layers.max_pooling2d(conv0, [2,2], [2,2])
conv1 = tf.layers.conv2d(pool0, 40, 5, activation = tf.nn.relu)
pool1 = tf.layers.max_pooling2d(conv1, [2,2], [2,2])
conv2 = tf.layers.conv2d(pool1, 80, 3, activation = tf.nn.relu)
pool2 = tf.layers.max_pooling2d(conv2, [2,2], [2,2])
conv3 = tf.layers.conv2d(pool1, 160, 3, activation = tf.nn.relu)
pool3 = tf.layers.max_pooling2d(conv3, [2,2], [2,2])

flatten = tf.layers.flatten(pool2)
fc0 = tf.layers.dense(flatten, 400, activation = tf.nn.relu)
fc1 = tf.layers.dense(fc0, 200, activation = tf.nn.relu)
dropout_fc = tf.layers.dropout(fc1, dropout_placeholder)
logits = tf.layers.dense(dropout_fc, num_classes)
predicted_labels = tf.arg_max(logits, 1)

losses = tf.nn.softmax_cross_entropy_with_logits(
        labels = tf.one_hot(labels_placeholder, num_classes),
        logits = logits
        )
mean_loss = tf.reduce_mean(losses)
optimizer = tf.train.AdamOptimizer(learning_rate = 1e-4).minimize(losses)

saver = tf.train.Saver()

with tf.Session() as sess:
    if train:
        print("Train")
        sess.run(tf.global_variables_initializer())
        train_feed_dict = {
                datas_placeholder: datas,
                labels_placeholder: labels,
                dropout_placeholder: 0.25
                }
        for step in range(750):
            _, mean_loss_val = sess.run([optimizer, mean_loss], feed_dict = train_feed_dict)
            if step % 50 == 0:
                print("step = {}\tmean loss = {}".format(step, mean_loss_val))
        saver.save(sess, model_path)
        print("Train end! Save model to {}".format(model_path))
    else:
        print("test")
        saver.restore(sess, model_path)
        print("import model from {}".format(model_path))
        label_name_dict = {
                0:"1",
                1:"2",
                }
        tdatas = []
        tpaths = []
        for tname in os.listdir(test_dir):
            tpath = os.path.join(test_dir, tname)
            tpaths.append(tpath)
            image = Image.open(tpath)
            tdata = np.array(image) / 255.0
            tdatas.append(tdata)
        tdatas = np.array(tdatas)

        test_feed_dict = {
                datas_placeholder: tdatas,
                labels_placeholder: [],
                dropout_placeholder: 0
                }
        predicted_labels_val = sess.run(predicted_labels, feed_dict = test_feed_dict)
        for tpath, predicted_label in zip(tpaths, predicted_labels_val):
            predicted_label_name = label_name_dict[predicted_label]
            print("{}\t=>{}".format(tpath, predicted_label_name))

